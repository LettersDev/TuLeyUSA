-- ============================================================
-- us_constitution.sql — MigraGuide USA
-- Restores the Constitution with the 'us_constitution' ID
-- ============================================================

INSERT INTO laws (id, title, title_es, category, type, article_count, searchable_text, searchable_text_es)
VALUES
('us_constitution', 'Constitution of the United States', 'Constitución de los Estados Unidos', 'citizenship', 'U.S. Constitution', 8,
 'constitution preamble rights government framework supreme law',
 'constitución preámbulo derechos gobierno marco ley suprema')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, title_es = EXCLUDED.title_es, article_count = EXCLUDED.article_count;

INSERT INTO law_items (id, law_id, index, number, title, title_es, text, text_es) VALUES
('us-const-1', 'us_constitution', 0, 1, 'Preamble', 'Preámbulo', 
 'We the People of the United States, in Order to form a more perfect Union, establish Justice, insure domestic Tranquility, provide for the common defence, promote the general Welfare, and secure the Blessings of Liberty to ourselves and our Posterity, do ordain and establish this Constitution for the United States of America.',
 'Nosotros, el Pueblo de los Estados Unidos, a fin de formar una Unión más perfecta, establecer Justicia, afirmar la tranquilidad prolija, proveer a la defensa común, promover el bienestar general y asegurar para nosotros mismos y para nuestra posteridad los beneficios de la libertad, ordenamos y establecemos esta Constitución para los Estados Unidos de América.'),

('us-const-2', 'us_constitution', 1, 2, 'Article I - The Legislative Branch', 'Artículo I - El Poder Legislativo',
 'All legislative Powers herein granted shall be vested in a Congress of the United States, which shall consist of a Senate and House of Representatives. The Legislative Branch is responsible for making laws, declaring war, and regulating commerce.',
 'Todos los poderes legislativos otorgados en la presente serán conferidos a un Congreso de los Estados Unidos, el cual se compondrá de un Senado y una Cámara de Representantes. El Poder Legislativo es responsable de crear leyes, declarar la guerra y regular el comercio.'),

('us-const-3', 'us_constitution', 2, 3, 'Article II - The Executive Branch', 'Artículo II - El Poder Ejecutivo',
 'The executive Power shall be vested in a President of the United States of America. He shall hold his Office during the Term of four Years. The Executive Branch implements and enforces laws.',
 'Se deposita el Poder Ejecutivo en un Presidente de los Estados Unidos de América. Desempeñará su encargo durante un término de cuatro años. El Poder Ejecutivo implementa y hace cumplir las leyes.'),

('us-const-4', 'us_constitution', 3, 4, 'Article III - The Judicial Branch', 'Artículo III - El Poder Judicial',
 'The judicial Power of the United States, shall be vested in one supreme Court, and in such inferior Courts as the Congress may from time to time ordain and establish. The Judicial Branch interprets the laws.',
 'Se deposita el Poder Judicial de los Estados Unidos en una Corte Suprema y en los tribunales inferiores que el Congreso de tiempo en tiempo ordenare y estableciere. El Poder Judicial interpreta las leyes.'),

('us-const-5', 'us_constitution', 4, 5, 'Article IV - States'' Relations', 'Artículo IV - Relaciones entre Estados',
 'Full Faith and Credit shall be given in each State to the public Acts, Records, and judicial Proceedings of every other State. Citizens of each State shall be entitled to all Privileges and Immunities of Citizens in the several States.',
 'Se dará entera fe y crédito en cada estado a los actos públicos, registros y procedimientos judiciales de todos los demás estados. Los ciudadanos de cada estado tendrán derecho a todos los privilegios e inmunidades de los ciudadanos de los demás estados.'),

('us-const-6', 'us_constitution', 5, 6, 'Article V - Mode of Amendment', 'Artículo V - Modo de Enmienda',
 'The Congress, whenever two thirds of both Houses shall deem it necessary, shall propose Amendments to this Constitution. This defines how the Constitution can be changed.',
 'El Congreso, siempre que las dos terceras partes de ambas Cámaras lo juzguen necesario, propondrá enmiendas a esta Constitución. Esto define cómo se puede cambiar la Constitución.'),

('us-const-7', 'us_constitution', 6, 7, 'Article VI - Prior Debts, National Supremacy, Oaths', 'Artículo VI - Deudas Prioritarias, Supremacía Nacional, Juramentos',
 'This Constitution, and the Laws of the United States which shall be made in Pursuance thereof; and all Treaties made, or which shall be made, under the Authority of the United States, shall be the supreme Law of the Land.',
 'Esta Constitución, y las leyes de los Estados Unidos que se expidieren en cumplimiento de ella, y todos los tratados celebrados o que se celebraren bajo la autoridad de los Estados Unidos, serán la ley suprema del país.'),

('us-const-8', 'us_constitution', 7, 8, 'Article VII - Ratification', 'Artículo VII - Ratificación',
 'The Ratification of the Conventions of nine States, shall be sufficient for the Establishment of this Constitution between the States so ratifying the Same.',
 'La ratificación por las convenciones de nueve estados será suficiente para el establecimiento de esta Constitución entre los estados que la ratifiquen.')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, title_es = EXCLUDED.title_es, text = EXCLUDED.text, text_es = EXCLUDED.text_es;

-- Update the article count and timestamp
UPDATE laws SET article_count = 8, last_updated = NOW() WHERE id = 'us_constitution';
UPDATE system_metadata SET laws_last_updated = NOW() WHERE id = 'main';
