import { supabase } from './supabaseClient';
import { FeedbackEntry, FeedbackModelType } from '../types';

/**
 * Database row structure for feedbacks table
 */
interface FeedbackRow {
    id: string;
    user_id: string;
    colleague_name: string;
    relation: string;
    model: string;
    model_data: Record<string, string>;
    generated_text: string;
    created_at: string;
    updated_at: string;
    is_deleted: boolean;
}

/**
 * Map database row to FeedbackEntry
 */
function mapRowToFeedback(row: FeedbackRow): FeedbackEntry {
    return {
        id: row.id,
        recipientName: row.colleague_name,
        authorName: '', // Will be populated from user data if needed
        relationship: row.relation,
        modelType: row.model as FeedbackModelType,
        inputData: row.model_data,
        generatedText: row.generated_text,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

/**
 * Map FeedbackEntry to database insert/update object
 */
function mapFeedbackToRow(feedback: Partial<FeedbackEntry>, userId: string): Partial<FeedbackRow> {
    const row: Partial<FeedbackRow> = {
        user_id: userId,
    };

    if (feedback.recipientName !== undefined) {
        row.colleague_name = feedback.recipientName;
    }
    if (feedback.relationship !== undefined) {
        row.relation = feedback.relationship;
    }
    if (feedback.modelType !== undefined) {
        row.model = feedback.modelType;
    }
    if (feedback.inputData !== undefined) {
        row.model_data = feedback.inputData;
    }
    if (feedback.generatedText !== undefined) {
        row.generated_text = feedback.generatedText;
    }

    return row;
}

/**
 * Create a new feedback entry in the database
 */
export async function createFeedback(feedback: Omit<FeedbackEntry, 'id' | 'createdAt' | 'updatedAt'>, userId: string): Promise<FeedbackEntry> {
    const row = mapFeedbackToRow(feedback, userId);

    const { data, error } = await supabase
        .from('feedbacks')
        .insert(row)
        .select()
        .single();

    if (error) {
        console.error('Error creating feedback:', error);
        throw new Error(`Failed to create feedback: ${error.message}`);
    }

    return mapRowToFeedback(data as FeedbackRow);
}

/**
 * Get all feedbacks for a specific user
 */
export async function getFeedbacks(userId: string): Promise<FeedbackEntry[]> {
    const { data, error } = await supabase
        .from('feedbacks')
        .select('*')
        .eq('user_id', userId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching feedbacks:', error);
        throw new Error(`Failed to fetch feedbacks: ${error.message}`);
    }

    return (data as FeedbackRow[]).map(mapRowToFeedback);
}

/**
 * Update an existing feedback
 */
export async function updateFeedback(id: string, updates: Partial<FeedbackEntry>, userId: string): Promise<FeedbackEntry> {
    const row = mapFeedbackToRow(updates, userId);
    row.updated_at = new Date().toISOString();

    const { data, error } = await supabase
        .from('feedbacks')
        .update(row)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

    if (error) {
        console.error('Error updating feedback:', error);
        throw new Error(`Failed to update feedback: ${error.message}`);
    }

    return mapRowToFeedback(data as FeedbackRow);
}

/**
 * Soft delete a feedback (set is_deleted = true)
 */
export async function deleteFeedback(id: string, userId: string): Promise<void> {
    const { error } = await supabase
        .from('feedbacks')
        .update({ is_deleted: true, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', userId);

    if (error) {
        console.error('Error deleting feedback:', error);
        throw new Error(`Failed to delete feedback: ${error.message}`);
    }
}
