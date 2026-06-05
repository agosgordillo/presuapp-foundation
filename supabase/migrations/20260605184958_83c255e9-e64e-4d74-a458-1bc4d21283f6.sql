
CREATE TABLE public.proyecto_repositorios (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  proyecto_id INT NOT NULL REFERENCES public.proyectos(id) ON DELETE CASCADE,
  nombre VARCHAR(100) NOT NULL,
  url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.proyecto_repositorios TO authenticated;
GRANT ALL ON public.proyecto_repositorios TO service_role;

ALTER TABLE public.proyecto_repositorios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "proyecto_repositorios_own" ON public.proyecto_repositorios
  FOR ALL TO authenticated
  USING (proyecto_id IN (SELECT p.id FROM public.proyectos p JOIN public.clientes c ON c.id = p.cliente_id WHERE c.usuario_id = public.current_usuario_id()))
  WITH CHECK (proyecto_id IN (SELECT p.id FROM public.proyectos p JOIN public.clientes c ON c.id = p.cliente_id WHERE c.usuario_id = public.current_usuario_id()));

CREATE INDEX idx_proyecto_repositorios_proyecto_id ON public.proyecto_repositorios(proyecto_id);

INSERT INTO public.proyecto_repositorios (proyecto_id, nombre, url)
SELECT id, 'Repositorio principal', repositorio_url
FROM public.proyectos
WHERE repositorio_url IS NOT NULL AND repositorio_url <> '';

ALTER TABLE public.proyectos DROP COLUMN repositorio_url;
