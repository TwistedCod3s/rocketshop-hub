
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DatabaseInputFieldsProps {
  supabaseUrl: string;
  supabaseKey: string;
  setSupabaseUrl: (url: string) => void;
  setSupabaseKey: (key: string) => void;
}

const DatabaseInputFields = ({
  supabaseUrl,
  supabaseKey,
  setSupabaseUrl,
  setSupabaseKey
}: DatabaseInputFieldsProps) => {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label htmlFor="supabase-url">Supabase URL</Label>
        <Input
          id="supabase-url"
          placeholder="https://your-project.supabase.co"
          value={supabaseUrl}
          onChange={(e) => setSupabaseUrl(e.target.value)}
          className="font-mono text-sm"
        />
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="supabase-key">Supabase Anon Key</Label>
        <Input
          id="supabase-key"
          type="password"
          placeholder="eyJhbGciOiJIUzI1N..."
          value={supabaseKey}
          onChange={(e) => setSupabaseKey(e.target.value)}
          className="font-mono text-sm"
        />
      </div>
    </div>
  );
};

export default DatabaseInputFields;
