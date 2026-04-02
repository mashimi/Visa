import { NextRequest, NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { extractTextFromFile } from '@/lib/documents/parser';
import { validateDocument } from '@/lib/documents/validator';

export async function POST(req: NextRequest) {
  if (!db || !auth) {
    return NextResponse.json(
      { 
        error: 'Firebase Admin not configured',
        message: 'Please configure Firebase Admin credentials in .env.local to use this feature.'
      }, 
      { status: 503 }
    );
  }

  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const formData = await req.formData();
    const files = formData.getAll('documents') as File[];

    const results = [];

    for (const file of files) {
      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Stealth Protocol: Extract intelligence without binary storage
        const extractedText = await extractTextFromFile(buffer, file.type);
        const validation = await validateDocument(extractedText, file.name);

        // Create Context Record (RAG Ready)
        const documentRef = await db.collection('userDocuments').add({
          userId,
          name: file.name,
          extractedText, // Searchable intelligence for the Agent
          category: validation.category,
          extractedData: validation.extractedData,
          status: validation.isValid ? 'VALIDATED' : 'FLAGGED',
          analysis: {
            issues: validation.issues,
            warnings: validation.warnings,
            suggestedQuestions: validation.suggestedQuestions
          },
          createdAt: FieldValue.serverTimestamp(),
          size: file.size,
          type: file.type,
          isContextOnly: true // Indicates zero binary footprint in Storage
        });

        // Update User Mission Intelligence (Aggregated Dossier)
        await db.collection('users').doc(userId).update({
          missionIntelligence: FieldValue.arrayUnion({
            id: documentRef.id,
            category: validation.category,
            data: validation.extractedData,
            summary: `${validation.category} analyzed: ${Object.keys(validation.extractedData).length} data points extracted`,
            timestamp: new Date().toISOString()
          }),
          'profile.lastIntelligenceSync': FieldValue.serverTimestamp()
        });

        results.push({
          id: documentRef.id,
          filename: file.name,
          category: validation.category,
          isValid: validation.isValid,
          issues: validation.issues,
          warnings: validation.warnings,
          suggestedQuestions: validation.suggestedQuestions,
        });

      } catch (error: any) {
        console.error('Error processing document intelligence:', error);
        results.push({
          filename: file.name,
          error: error.message || 'Intelligence extraction failed',
        });
      }
    }

    return NextResponse.json({ documents: results });
  } catch (error: any) {
    console.error('Context ingestion error:', error);
    return NextResponse.json(
      { error: error.message || 'Mission context ingestion failed' },
      { status: 500 }
    );
  }
}