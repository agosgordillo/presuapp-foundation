
-- Drop plaintext password column (auth handled by Supabase Auth)
ALTER TABLE public.usuarios DROP COLUMN IF EXISTS password;

-- Replace overly-permissive self policy with column-safe split policies
DROP POLICY IF EXISTS usuarios_self ON public.usuarios;

CREATE POLICY usuarios_select_self ON public.usuarios
  FOR SELECT TO authenticated
  USING (auth_user_id = auth.uid());

CREATE POLICY usuarios_insert_self ON public.usuarios
  FOR INSERT TO authenticated
  WITH CHECK (auth_user_id = auth.uid());

-- UPDATE: cannot change auth_user_id (must remain equal to current auth.uid())
CREATE POLICY usuarios_update_self ON public.usuarios
  FOR UPDATE TO authenticated
  USING (auth_user_id = auth.uid())
  WITH CHECK (auth_user_id = auth.uid());

-- Prevent changing auth_user_id at the column level via trigger guard
CREATE OR REPLACE FUNCTION public.prevent_auth_user_id_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.auth_user_id IS DISTINCT FROM OLD.auth_user_id THEN
    RAISE EXCEPTION 'auth_user_id cannot be modified';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS usuarios_lock_auth_user_id ON public.usuarios;
CREATE TRIGGER usuarios_lock_auth_user_id
  BEFORE UPDATE ON public.usuarios
  FOR EACH ROW EXECUTE FUNCTION public.prevent_auth_user_id_change();
