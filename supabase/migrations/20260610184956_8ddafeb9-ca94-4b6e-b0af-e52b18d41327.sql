
REVOKE EXECUTE ON FUNCTION public.prevent_auth_user_id_change() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
