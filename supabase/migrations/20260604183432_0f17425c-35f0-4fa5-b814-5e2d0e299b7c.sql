
-- ============================================================
-- USUARIOS (bridge between auth.users and app data)
-- ============================================================
CREATE TABLE public.usuarios (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL DEFAULT '',
  empresa_nombre VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.usuarios TO authenticated;
GRANT ALL ON public.usuarios TO service_role;
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "usuarios_self" ON public.usuarios FOR ALL TO authenticated
  USING (auth_user_id = auth.uid()) WITH CHECK (auth_user_id = auth.uid());

-- Helper function: current usuario.id from auth.uid()
CREATE OR REPLACE FUNCTION public.current_usuario_id()
RETURNS INT LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT id FROM public.usuarios WHERE auth_user_id = auth.uid() LIMIT 1;
$$;

-- ============================================================
-- CLIENTES
-- ============================================================
CREATE TABLE public.clientes (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  usuario_id INT NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  empresa VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clientes TO authenticated;
GRANT ALL ON public.clientes TO service_role;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "clientes_own" ON public.clientes FOR ALL TO authenticated
  USING (usuario_id = public.current_usuario_id())
  WITH CHECK (usuario_id = public.current_usuario_id());

-- ============================================================
-- PROYECTOS
-- ============================================================
CREATE TABLE public.proyectos (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  cliente_id INT NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  estado VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
  repositorio_url VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.proyectos TO authenticated;
GRANT ALL ON public.proyectos TO service_role;
ALTER TABLE public.proyectos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "proyectos_own" ON public.proyectos FOR ALL TO authenticated
  USING (cliente_id IN (SELECT id FROM public.clientes WHERE usuario_id = public.current_usuario_id()))
  WITH CHECK (cliente_id IN (SELECT id FROM public.clientes WHERE usuario_id = public.current_usuario_id()));

-- ============================================================
-- CATALOGO_ITEMS
-- ============================================================
CREATE TABLE public.catalogo_items (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  usuario_id INT NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  tipo_unidad VARCHAR(50) NOT NULL,
  precio_referecia DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.catalogo_items TO authenticated;
GRANT ALL ON public.catalogo_items TO service_role;
ALTER TABLE public.catalogo_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "catalogo_own" ON public.catalogo_items FOR ALL TO authenticated
  USING (usuario_id = public.current_usuario_id())
  WITH CHECK (usuario_id = public.current_usuario_id());

-- ============================================================
-- PRESUPUESTOS
-- ============================================================
CREATE TABLE public.presupuestos (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  proyecto_id INT NOT NULL REFERENCES public.proyectos(id) ON DELETE CASCADE,
  codigo VARCHAR(20) NOT NULL,
  fecha_emision DATE NOT NULL DEFAULT CURRENT_DATE,
  estado VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
  subtotal DECIMAL(10,2) NOT NULL,
  impuestos DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  pdf_url VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.presupuestos TO authenticated;
GRANT ALL ON public.presupuestos TO service_role;
ALTER TABLE public.presupuestos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "presupuestos_own" ON public.presupuestos FOR ALL TO authenticated
  USING (proyecto_id IN (
    SELECT p.id FROM public.proyectos p
    JOIN public.clientes c ON c.id = p.cliente_id
    WHERE c.usuario_id = public.current_usuario_id()
  ))
  WITH CHECK (proyecto_id IN (
    SELECT p.id FROM public.proyectos p
    JOIN public.clientes c ON c.id = p.cliente_id
    WHERE c.usuario_id = public.current_usuario_id()
  ));

-- ============================================================
-- PRESUPUESTO_ITEMS
-- ============================================================
CREATE TABLE public.presupuesto_items (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  presupuesto_id INT NOT NULL REFERENCES public.presupuestos(id) ON DELETE CASCADE,
  nombre_historico VARCHAR(100) NOT NULL,
  tipo_unidad_historica VARCHAR(50) NOT NULL,
  cantidad DECIMAL(10,2) NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  subtotal_item DECIMAL(10,2) NOT NULL
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.presupuesto_items TO authenticated;
GRANT ALL ON public.presupuesto_items TO service_role;
ALTER TABLE public.presupuesto_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "presupuesto_items_own" ON public.presupuesto_items FOR ALL TO authenticated
  USING (presupuesto_id IN (
    SELECT pr.id FROM public.presupuestos pr
    JOIN public.proyectos p ON p.id = pr.proyecto_id
    JOIN public.clientes c ON c.id = p.cliente_id
    WHERE c.usuario_id = public.current_usuario_id()
  ))
  WITH CHECK (presupuesto_id IN (
    SELECT pr.id FROM public.presupuestos pr
    JOIN public.proyectos p ON p.id = pr.proyecto_id
    JOIN public.clientes c ON c.id = p.cliente_id
    WHERE c.usuario_id = public.current_usuario_id()
  ));

-- ============================================================
-- PAGOS
-- ============================================================
CREATE TABLE public.pagos (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  proyecto_id INT NOT NULL REFERENCES public.proyectos(id) ON DELETE CASCADE,
  fecha_pago DATE NOT NULL DEFAULT CURRENT_DATE,
  monto DECIMAL(10,2) NOT NULL,
  metodo VARCHAR(50) NOT NULL,
  notas TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pagos TO authenticated;
GRANT ALL ON public.pagos TO service_role;
ALTER TABLE public.pagos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pagos_own" ON public.pagos FOR ALL TO authenticated
  USING (proyecto_id IN (
    SELECT p.id FROM public.proyectos p
    JOIN public.clientes c ON c.id = p.cliente_id
    WHERE c.usuario_id = public.current_usuario_id()
  ))
  WITH CHECK (proyecto_id IN (
    SELECT p.id FROM public.proyectos p
    JOIN public.clientes c ON c.id = p.cliente_id
    WHERE c.usuario_id = public.current_usuario_id()
  ));

-- ============================================================
-- AUTO-PROVISION usuario row on signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.usuarios (auth_user_id, nombre, email, empresa_nombre)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nombre', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'empresa_nombre', 'Mi Empresa')
  )
  ON CONFLICT (auth_user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
