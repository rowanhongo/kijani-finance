import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return toast({ title: 'Missing config', description: 'Supabase not configured' });
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      toast({ title: 'Check email', description: 'Signup successful. Check your email to confirm.' });
    } catch (err) {
      toast({ title: 'Signup error', description: String(err) });
    }
  };

  return (
    <AppLayout>
      <div className="max-w-lg mx-auto">
        <h1 className="text-xl font-semibold mb-4">Sign up</h1>
        <form onSubmit={handleSignup} className="space-y-3">
          <input className="w-full p-2 border" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full p-2 border" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="px-4 py-2 bg-primary text-white" type="submit">Sign up</button>
        </form>
      </div>
    </AppLayout>
  );
}
