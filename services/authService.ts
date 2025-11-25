import { supabase } from './supabaseClient';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    role?: string;
}

/**
 * Sign up a new user with email and password
 */
export const signUp = async (email: string, password: string, name: string) => {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                },
            },
        });

        if (error) throw error;
        return { user: data.user, error: null };
    } catch (error: any) {
        return { user: null, error: error.message };
    }
};

/**
 * Sign in with email and password
 */
export const signIn = async (email: string, password: string) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;
        return { user: data.user, session: data.session, error: null };
    } catch (error: any) {
        return { user: null, session: null, error: error.message };
    }
};

/**
 * Sign in with Google OAuth
 */
export const signInWithGoogle = async () => {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin,
            },
        });

        if (error) throw error;
        return { error: null };
    } catch (error: any) {
        return { error: error.message };
    }
};

/**
 * Sign out the current user
 */
export const signOut = async () => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return { error: null };
    } catch (error: any) {
        return { error: error.message };
    }
};

/**
 * Get the current session
 */
export const getCurrentSession = async () => {
    try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        return { session: data.session, error: null };
    } catch (error: any) {
        return { session: null, error: error.message };
    }
};

/**
 * Get the current user
 */
export const getCurrentUser = async (): Promise<AuthUser | null> => {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;

        if (!user) return null;

        return convertSupabaseUser(user);
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
};

/**
 * Listen to auth state changes
 */
export const onAuthStateChange = (callback: (user: AuthUser | null) => void) => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
            if (session?.user) {
                callback(convertSupabaseUser(session.user));
            } else {
                callback(null);
            }
        }
    );

    return subscription;
};

/**
 * Convert Supabase user to AuthUser
 */
const convertSupabaseUser = (user: SupabaseUser): AuthUser => {
    return {
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        role: user.user_metadata?.role || 'User',
    };
};
