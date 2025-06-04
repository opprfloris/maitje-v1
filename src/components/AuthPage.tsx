
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await signIn(email, password);
      } else {
        result = await signUp(email, password, firstName, lastName);
      }

      if (result.error) {
        toast({
          title: "Fout",
          description: result.error.message || "Er is een fout opgetreden",
          variant: "destructive",
        });
      } else if (!isLogin) {
        toast({
          title: "Registratie gelukt!",
          description: "Check je email voor bevestiging",
        });
      }
    } catch (error) {
      toast({
        title: "Fout",
        description: "Er is een onverwachte fout opgetreden",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-maitje-cream flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-maitje-blue rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
            🦉
          </div>
          <h1 className="text-3xl font-nunito font-bold text-gray-800 mb-2">
            Welkom bij mAItje
          </h1>
          <p className="text-gray-600 font-nunito">
            {isLogin ? 'Log in om verder te gaan' : 'Maak een account aan'}
          </p>
        </div>

        <div className="maitje-card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <Label htmlFor="firstName">Voornaam</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required={!isLogin}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Achternaam</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required={!isLogin}
                    className="mt-1"
                  />
                </div>
              </>
            )}
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="password">Wachtwoord</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <Button
              type="submit"
              className="w-full maitje-button"
              disabled={loading}
            >
              {loading ? 'Bezig...' : (isLogin ? 'Inloggen' : 'Registreren')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-maitje-blue hover:underline font-nunito"
            >
              {isLogin ? 'Nog geen account? Registreer hier' : 'Al een account? Log hier in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
