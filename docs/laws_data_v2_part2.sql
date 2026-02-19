-- ============================================================
-- laws_data_v2_part2.sql — MigraGuide USA
-- Additional Laws: DV Lottery, Parole, Marriage GC, Forms, Civics
-- Run in Supabase SQL Editor AFTER laws_data_v2.sql
-- ============================================================

-- ============================================================
-- DIVERSITY VISA (DV LOTTERY)
-- ============================================================

INSERT INTO laws (id, title, title_es, category, type, article_count, searchable_text, searchable_text_es)
VALUES
('dv-lottery', 'Diversity Visa Lottery Program', 'Programa de Lotería de Visas de Diversidad', 'visas', 'Federal Program', 4,
 'diversity visa lottery DV green card random selection eligible countries annual program',
 'lotería visa diversidad DV tarjeta verde selección aleatoria países elegibles programa anual')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, title_es = EXCLUDED.title_es, article_count = EXCLUDED.article_count;

INSERT INTO law_items (id, law_id, index, number, title, title_es, text, text_es) VALUES
('dv-1', 'dv-lottery', 0, 1, 'Program Overview', 'Descripción del Programa',
 'The Diversity Visa (DV) program makes up to 55,000 immigrant visas available annually through a random lottery. It is designed to diversify immigration by selecting applicants from countries with historically low rates of immigration to the US. Registration is free through the official State Department website (dvprogram.state.gov). Beware of scam websites that charge fees.',
 'El programa de Visa de Diversidad (DV) pone hasta 55,000 visas de inmigrante disponibles anualmente a través de una lotería aleatoria. Está diseñado para diversificar la inmigración seleccionando solicitantes de países con tasas históricamente bajas de inmigración a EE.UU. El registro es gratuito a través del sitio web oficial del Departamento de Estado (dvprogram.state.gov). Cuidado con sitios web fraudulentos que cobran.'),
('dv-2', 'dv-lottery', 1, 2, 'Eligibility', 'Elegibilidad',
 'Requirements: (1) born in an eligible country (most countries qualify; Mexico, El Salvador, Honduras, Guatemala, Dominican Republic, and others with high immigration are typically excluded); (2) have at least a high school diploma or equivalent; OR (3) have 2 years of work experience in the last 5 years in an occupation requiring at least 2 years of training. The registration period is usually October-November each year.',
 'Requisitos: (1) haber nacido en un país elegible (la mayoría de países califican; México, El Salvador, Honduras, Guatemala, República Dominicana y otros con alta inmigración típicamente están excluidos); (2) tener al menos diploma de secundaria o equivalente; O (3) tener 2 años de experiencia laboral en los últimos 5 años en una ocupación que requiere al menos 2 años de capacitación. El período de registro es usualmente octubre-noviembre cada año.'),
('dv-3', 'dv-lottery', 2, 3, 'Selection and Processing', 'Selección y Procesamiento',
 'If selected: (1) you will be notified through the Entrant Status Check portal (NOT by email); (2) you must complete Form DS-260 (immigrant visa application); (3) attend a consular interview; (4) pass background checks and medical exam; (5) you must process your visa within the fiscal year (October 1 - September 30) or lose your selection. Selection does NOT guarantee a visa.',
 'Si es seleccionado: (1) será notificado a través del portal de Verificación de Estado del Participante (NO por correo electrónico); (2) debe completar el Formulario DS-260 (solicitud de visa de inmigrante); (3) asistir a una entrevista consular; (4) pasar verificación de antecedentes y examen médico; (5) debe procesar su visa dentro del año fiscal (1 de octubre - 30 de septiembre) o perderá su selección. La selección NO garantiza una visa.'),
('dv-4', 'dv-lottery', 3, 4, 'Common Mistakes to Avoid', 'Errores Comunes a Evitar',
 'Avoid these mistakes: (1) submitting more than one entry per person (leads to disqualification); (2) using unofficial websites (the ONLY official site is dvprogram.state.gov); (3) paying someone to submit your entry (registration is FREE); (4) not checking the results (State Dept does NOT notify winners by email); (5) missing deadlines (they are strictly enforced); (6) providing inaccurate information (can lead to visa denial).',
 'Evite estos errores: (1) enviar más de una entrada por persona (lleva a descalificación); (2) usar sitios web no oficiales (el ÚNICO sitio oficial es dvprogram.state.gov); (3) pagar a alguien para enviar su entrada (el registro es GRATUITO); (4) no verificar los resultados (el Depto. de Estado NO notifica ganadores por email); (5) perder fechas límite (se aplican estrictamente); (6) proporcionar información inexacta (puede llevar a denegación de visa).')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, title_es = EXCLUDED.title_es, text = EXCLUDED.text, text_es = EXCLUDED.text_es;

-- ============================================================
-- HUMANITARIAN PAROLE (CHNV & Others)
-- ============================================================

INSERT INTO laws (id, title, title_es, category, type, article_count, searchable_text, searchable_text_es)
VALUES
('parole', 'Humanitarian Parole Programs', 'Programas de Parole Humanitario', 'asylum', 'Executive Policy', 4,
 'humanitarian parole CHNV Cuba Haiti Nicaragua Venezuela sponsor urgent reasons temporary',
 'parole humanitario CHNV Cuba Haití Nicaragua Venezuela patrocinador razones urgentes temporal')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, title_es = EXCLUDED.title_es, article_count = EXCLUDED.article_count;

INSERT INTO law_items (id, law_id, index, number, title, title_es, text, text_es) VALUES
('parole-1', 'parole', 0, 1, 'What is Parole?', '¿Qué es el Parole?',
 'Parole under INA §212(d)(5) allows the Secretary of Homeland Security to temporarily allow an individual into the US for "urgent humanitarian reasons" or "significant public benefit." Parole is NOT an admission — it is a temporary measure. Parolees may apply for asylum, adjustment of status (if otherwise eligible), or other benefits. Parole can be revoked at any time.',
 'El Parole bajo la INA §212(d)(5) permite al Secretario de Seguridad Nacional permitir temporalmente a un individuo entrar a EE.UU. por "razones humanitarias urgentes" o "beneficio público significativo." El Parole NO es una admisión — es una medida temporal. Los beneficiarios pueden solicitar asilo, ajuste de estatus (si son elegibles) u otros beneficios. El Parole puede ser revocado en cualquier momento.'),
('parole-2', 'parole', 1, 2, 'CHNV Parole Programs', 'Programas de Parole CHNV',
 'The CHNV programs (Cuba, Haiti, Nicaragua, Venezuela) allow nationals of these countries to enter the US with a sponsor. Requirements: (1) a US-based financial sponsor files Form I-134A (declaration of financial support); (2) the beneficiary must be outside the US; (3) must pass vetting and background checks; (4) must have a valid passport; (5) must not have been removed from the US in the prior 5 years. Grants 2-year parole with work authorization.',
 'Los programas CHNV (Cuba, Haití, Nicaragua, Venezuela) permiten que nacionales de estos países entren a EE.UU. con un patrocinador. Requisitos: (1) un patrocinador financiero en EE.UU. presenta el Formulario I-134A; (2) el beneficiario debe estar fuera de EE.UU.; (3) debe pasar verificación y antecedentes; (4) debe tener pasaporte válido; (5) no haber sido removido de EE.UU. en los 5 años anteriores. Otorga parole de 2 años con autorización de trabajo.'),
('parole-3', 'parole', 2, 3, 'Sponsor Requirements (I-134A)', 'Requisitos del Patrocinador (I-134A)',
 'The US-based sponsor must: (1) be a US citizen, permanent resident, or person in legal status; (2) demonstrate sufficient financial resources to support the beneficiary (income above 100% of federal poverty guidelines); (3) agree to provide housing, financial support, and help with resettlement; (4) pass background checks. A sponsor can support multiple beneficiaries. Organizations can also serve as sponsors.',
 'El patrocinador en EE.UU. debe: (1) ser ciudadano, residente permanente o persona en estatus legal; (2) demostrar recursos financieros suficientes para mantener al beneficiario (ingresos superiores al 100% de las guías federales de pobreza); (3) acordar proporcionar vivienda, apoyo financiero y ayuda con la reubicación; (4) pasar verificación de antecedentes. Un patrocinador puede apoyar a múltiples beneficiarios. Las organizaciones también pueden servir como patrocinadores.'),
('parole-4', 'parole', 3, 4, 'After Parole — Next Steps', 'Después del Parole — Siguientes Pasos',
 'Parole is temporary (usually 2 years). Before it expires, parolees should explore: (1) Apply for asylum (if eligible, within 1 year of arrival); (2) Apply for TPS if their country is designated; (3) Marry a US citizen and apply for adjustment of status; (4) Seek employment-based sponsorship; (5) Special Immigrant Juvenile Status (for minors). Without another immigration benefit, parolees must depart when parole expires.',
 'El Parole es temporal (usualmente 2 años). Antes de que expire, los beneficiarios deben explorar: (1) Solicitar asilo (si son elegibles, dentro de 1 año de llegada); (2) Solicitar TPS si su país está designado; (3) Casarse con un ciudadano y solicitar ajuste de estatus; (4) Buscar patrocinio basado en empleo; (5) Estatus Especial de Inmigrante Juvenil (para menores). Sin otro beneficio migratorio, los beneficiarios deben partir cuando expire el parole.')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, title_es = EXCLUDED.title_es, text = EXCLUDED.text, text_es = EXCLUDED.text_es;

-- ============================================================
-- GREEN CARD BY MARRIAGE — Step-by-Step
-- ============================================================

INSERT INTO laws (id, title, title_es, category, type, article_count, searchable_text, searchable_text_es)
VALUES
('gc-marriage', 'Green Card Through Marriage', 'Tarjeta Verde por Matrimonio', 'family', 'Process Guide', 5,
 'green card marriage spouse petition I-130 I-485 interview conditional permanent resident',
 'tarjeta verde matrimonio cónyuge petición I-130 I-485 entrevista condicional residente permanente')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, title_es = EXCLUDED.title_es, article_count = EXCLUDED.article_count;

INSERT INTO law_items (id, law_id, index, number, title, title_es, text, text_es) VALUES
('gc-mar-1', 'gc-marriage', 0, 1, 'Process Overview', 'Descripción del Proceso',
 'Spouses of US citizens are immediate relatives (no visa wait). Spouses of permanent residents fall under F2A preference. Process: (1) File I-130; (2) If in the US: concurrently file I-485 (adjustment of status); If abroad: wait for visa availability then consular processing (DS-260). Filing fees: I-130 ($535) + I-485 ($1,440 including biometrics) or DS-260 ($325 + medical exam). Processing times vary from 8-24 months.',
 'Los cónyuges de ciudadanos son familiares inmediatos (sin espera de visa). Los cónyuges de residentes permanentes caen bajo preferencia F2A. Proceso: (1) Presentar I-130; (2) Si está en EE.UU.: presentar concurrentemente I-485 (ajuste de estatus); Si está en el extranjero: esperar disponibilidad de visa y procesamiento consular (DS-260). Costos: I-130 ($535) + I-485 ($1,440 incluyendo biométricos) o DS-260 ($325 + examen médico). Tiempos de procesamiento varían de 8-24 meses.'),
('gc-mar-2', 'gc-marriage', 1, 2, 'Required Documents', 'Documentos Requeridos',
 'Key documents: (1) Marriage certificate; (2) Proof of bona fide marriage (joint bank accounts, lease/mortgage, photos, affidavits from friends/family); (3) Proof of legal entry (I-94, visa stamp, passport); (4) Birth certificate of petitioner and beneficiary; (5) Tax returns (3 years); (6) I-864 Affidavit of Support (petitioner must earn 125% of federal poverty guidelines); (7) Passport-style photos; (8) Medical examination (Form I-693).',
 'Documentos clave: (1) Certificado de matrimonio; (2) Prueba de matrimonio de buena fe (cuentas bancarias conjuntas, contrato de arrendamiento/hipoteca, fotos, declaraciones juradas de amigos/familia); (3) Prueba de entrada legal (I-94, sello de visa, pasaporte); (4) Acta de nacimiento del peticionario y beneficiario; (5) Declaraciones de impuestos (3 años); (6) Declaración Jurada de Manutención I-864 (peticionario debe ganar 125% de guías federales de pobreza); (7) Fotos tipo pasaporte; (8) Examen médico (Formulario I-693).'),
('gc-mar-3', 'gc-marriage', 2, 3, 'The Marriage Interview', 'La Entrevista de Matrimonio',
 'USCIS conducts an interview to verify the marriage is genuine. Common questions: How did you meet? Describe your wedding. What did you do last weekend? Describe your home layout. What side of the bed does your spouse sleep on? Tips: (1) Be honest; (2) Bring original documents plus evidence of shared life; (3) Both spouses must attend; (4) Arrive early; (5) If separated, bring evidence of officer may interview spouses together or separately.',
 'USCIS realiza una entrevista para verificar que el matrimonio es genuino. Preguntas comunes: ¿Cómo se conocieron? Describa su boda. ¿Qué hicieron el fin de semana pasado? Describa la distribución de su hogar. ¿En qué lado de la cama duerme su cónyuge? Consejos: (1) Sea honesto; (2) Traiga documentos originales más evidencia de vida compartida; (3) Ambos cónyuges deben asistir; (4) Llegue temprano; (5) El oficial puede entrevistar a los cónyuges juntos o por separado.'),
('gc-mar-4', 'gc-marriage', 3, 4, 'Conditional Green Card (2-Year)', 'Tarjeta Verde Condicional (2 Años)',
 'If married less than 2 years at the time of approval, you receive a conditional green card (valid for 2 years). You MUST file Form I-751 (Petition to Remove Conditions) jointly with your spouse during the 90-day window before it expires. Failure to file results in automatic termination of status. If divorced: you can file a waiver requesting to remove conditions without the spouse''s participation, showing the marriage was entered in good faith.',
 'Si estuvo casado menos de 2 años al momento de aprobación, recibe una tarjeta verde condicional (válida por 2 años). DEBE presentar el Formulario I-751 (Petición para Remover Condiciones) conjuntamente con su cónyuge durante la ventana de 90 días antes de que expire. No presentar resulta en terminación automática del estatus. Si se divorció: puede presentar un perdón solicitando remover condiciones sin la participación del cónyuge, demostrando que el matrimonio fue de buena fe.'),
('gc-mar-5', 'gc-marriage', 4, 5, 'Undocumented Spouse Options', 'Opciones para Cónyuge Indocumentado',
 'If the foreign spouse entered WITH inspection (visa, visa waiver, parole): can adjust status in the US (I-485) even if overstayed. If entered WITHOUT inspection: generally must depart and process at a consulate, triggering the 3/10-year bar. Solution: I-601A provisional waiver (if married to USC) filed BEFORE departing, then attend consular interview. If 245(i) eligible (petition filed before April 30, 2001): can adjust in the US regardless of entry.',
 'Si el cónyuge extranjero entró CON inspección (visa, exención de visa, parole): puede ajustar estatus en EE.UU. (I-485) incluso si se quedó más tiempo. Si entró SIN inspección: generalmente debe salir y procesar en un consulado, activando la prohibición de 3/10 años. Solución: perdón provisional I-601A (si casado con ciudadano) presentado ANTES de partir, luego asistir a entrevista consular. Si es elegible bajo 245(i) (petición presentada antes del 30 de abril de 2001): puede ajustar en EE.UU. independientemente de la entrada.')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, title_es = EXCLUDED.title_es, text = EXCLUDED.text, text_es = EXCLUDED.text_es;

-- ============================================================
-- COMMON USCIS FORMS GUIDE
-- ============================================================

INSERT INTO laws (id, title, title_es, category, type, article_count, searchable_text, searchable_text_es)
VALUES
('uscis-forms', 'Essential USCIS Forms Guide', 'Guía de Formularios Esenciales de USCIS', 'visas', 'Reference Guide', 5,
 'USCIS forms I-130 I-485 I-765 I-131 I-864 I-751 N-400 filing fees requirements',
 'formularios USCIS I-130 I-485 I-765 I-131 I-864 I-751 N-400 costos requisitos')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, title_es = EXCLUDED.title_es, article_count = EXCLUDED.article_count;

INSERT INTO law_items (id, law_id, index, number, title, title_es, text, text_es) VALUES
('form-1', 'uscis-forms', 0, 1, 'Family Petition Forms', 'Formularios de Petición Familiar',
 'I-130 (Petition for Alien Relative): Filed by USC or LPR to sponsor a family member. Fee: $535. I-130A (Supplemental Information): Required for spouse beneficiaries. I-864 (Affidavit of Support): Sponsor must prove income ≥125% of poverty line. If income insufficient, use joint sponsor or include assets. I-864A: Contract between sponsor and household member contributing income.',
 'I-130 (Petición para Familiar Extranjero): Presentado por ciudadano o LPR para patrocinar familiar. Costo: $535. I-130A (Información Suplementaria): Requerido para beneficiarios cónyuges. I-864 (Declaración Jurada de Manutención): Patrocinador debe demostrar ingresos ≥125% de línea de pobreza. Si ingresos insuficientes, usar co-patrocinador o incluir activos. I-864A: Contrato entre patrocinador y miembro del hogar que contribuye ingresos.'),
('form-2', 'uscis-forms', 1, 2, 'Green Card Forms', 'Formularios de Tarjeta Verde',
 'I-485 (Adjustment of Status): Apply for green card while in the US. Fee: $1,440. I-693 (Medical Examination): Must be completed by a USCIS-designated civil surgeon. I-751 (Remove Conditions on 2-year green card): File jointly with spouse 90 days before expiration. Fee: $750. I-829 (Remove Conditions on EB-5 green card). I-90 (Renew/Replace green card): Fee: $455.',
 'I-485 (Ajuste de Estatus): Solicitar tarjeta verde estando en EE.UU. Costo: $1,440. I-693 (Examen Médico): Debe ser completado por un cirujano civil designado por USCIS. I-751 (Remover Condiciones de tarjeta verde de 2 años): Presentar conjuntamente con cónyuge 90 días antes del vencimiento. Costo: $750. I-829 (Remover Condiciones de tarjeta verde EB-5). I-90 (Renovar/Reemplazar tarjeta verde): Costo: $455.'),
('form-3', 'uscis-forms', 2, 3, 'Work & Travel Forms', 'Formularios de Trabajo y Viaje',
 'I-765 (EAD Application): For work authorization. Fee: $410 (free when filed with I-485). Processing: 3-7 months. I-131 (Advance Parole/Travel Document): Travel while adjustment is pending. Fee: $630 (free with I-485). WARNING: If you leave the US without advance parole while I-485 is pending, your application is considered abandoned. Combo card (EAD + AP) is commonly issued.',
 'I-765 (Solicitud de EAD): Para autorización de trabajo. Costo: $410 (gratis al presentar con I-485). Procesamiento: 3-7 meses. I-131 (Advance Parole/Documento de Viaje): Viajar mientras ajuste está pendiente. Costo: $630 (gratis con I-485). ADVERTENCIA: Si sale de EE.UU. sin advance parole mientras I-485 está pendiente, su solicitud se considera abandonada. La tarjeta combo (EAD + AP) es comúnmente emitida.'),
('form-4', 'uscis-forms', 3, 4, 'Citizenship Forms', 'Formularios de Ciudadanía',
 'N-400 (Naturalization Application): Fee: $710. Processing: 8-14 months. N-600 (Certificate of Citizenship): For those who derived or acquired citizenship. Fee: $1,170. N-648 (Medical Certification for Disability Exception): Waiver of English/civics test for qualifying disabilities. Reduced fee: $405 (for household income 150-200% of poverty line). Fee waiver: Form I-912 (for income below 150%).',
 'N-400 (Solicitud de Naturalización): Costo: $710. Procesamiento: 8-14 meses. N-600 (Certificado de Ciudadanía): Para quienes derivaron o adquirieron ciudadanía. Costo: $1,170. N-648 (Certificación Médica para Excepción por Discapacidad): Exención del examen de inglés/cívica por discapacidades calificadas. Tarifa reducida: $405 (ingresos del hogar 150-200% de línea de pobreza). Exención de tarifa: Formulario I-912 (ingresos inferiores al 150%).'),
('form-5', 'uscis-forms', 4, 5, 'Humanitarian Forms', 'Formularios Humanitarios',
 'I-589 (Asylum/Withholding of Removal): FREE — no filing fee. I-918 (U Visa Petition): FREE. I-914 (T Visa Application): FREE. I-360 (VAWA Self-Petition): FREE. I-821 (TPS Application): $50 plus $85 biometrics. I-134A (Declaration of Financial Support for Parole): FREE. I-601 (Waiver of Inadmissibility): $930. I-601A (Provisional Waiver): $630. Most humanitarian forms have NO filing fee.',
 'I-589 (Asilo/Retención de Remoción): GRATIS — sin tarifa. I-918 (Petición Visa U): GRATIS. I-914 (Solicitud Visa T): GRATIS. I-360 (Autopetición VAWA): GRATIS. I-821 (Solicitud TPS): $50 más $85 biométricos. I-134A (Declaración de Apoyo Financiero para Parole): GRATIS. I-601 (Perdón de Inadmisibilidad): $930. I-601A (Perdón Provisional): $630. La mayoría de formularios humanitarios NO tienen tarifa.')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, title_es = EXCLUDED.title_es, text = EXCLUDED.text, text_es = EXCLUDED.text_es;

-- ============================================================
-- CITIZENSHIP INTERVIEW PREPARATION
-- ============================================================

INSERT INTO laws (id, title, title_es, category, type, article_count, searchable_text, searchable_text_es)
VALUES
('civics-prep', 'Citizenship Interview & Civics Preparation', 'Preparación para Entrevista y Examen Cívico', 'citizenship', 'Study Guide', 5,
 'citizenship interview civics test 100 questions naturalization preparation english study',
 'ciudadanía entrevista examen cívico 100 preguntas naturalización preparación inglés estudio')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, title_es = EXCLUDED.title_es, article_count = EXCLUDED.article_count;

INSERT INTO law_items (id, law_id, index, number, title, title_es, text, text_es) VALUES
('civics-1', 'civics-prep', 0, 1, 'Interview Overview', 'Descripción de la Entrevista',
 'The naturalization interview includes: (1) English test: reading (read 1 of 3 sentences), writing (write 1 of 3 sentences), speaking (conversation with officer); (2) Civics test: answer 6 of 10 questions correctly from the 100 civics questions; (3) Review of N-400 application (questions about background, trips, moral character). The interview is typically 15-30 minutes. Bring: appointment notice, green card, passport, state ID, and any supporting documents.',
 'La entrevista de naturalización incluye: (1) Examen de inglés: lectura (leer 1 de 3 oraciones), escritura (escribir 1 de 3 oraciones), conversación (con el oficial); (2) Examen cívico: responder correctamente 6 de 10 preguntas de las 100 preguntas cívicas; (3) Revisión de la solicitud N-400 (preguntas sobre antecedentes, viajes, carácter moral). La entrevista típicamente dura 15-30 minutos. Traiga: notificación de cita, tarjeta verde, pasaporte, ID estatal y documentos de respaldo.'),
('civics-2', 'civics-prep', 1, 2, 'Government & Democracy (Q1-28)', 'Gobierno y Democracia (P1-28)',
 'Key questions: What is the supreme law of the land? (The Constitution). What does the Constitution do? (Sets up the government, defines the government, protects basic rights). What are the first three words of the Constitution? (We the People). What is an amendment? (A change or addition to the Constitution). How many amendments does the Constitution have? (27). What are the first ten amendments called? (The Bill of Rights). Name one right from the First Amendment. (Speech, religion, assembly, press, petition the government).',
 'Preguntas clave: ¿Cuál es la ley suprema del país? (La Constitución). ¿Qué hace la Constitución? (Establece el gobierno, define el gobierno, protege derechos básicos). ¿Cuáles son las tres primeras palabras de la Constitución? (We the People / Nosotros el Pueblo). ¿Qué es una enmienda? (Un cambio o adición a la Constitución). ¿Cuántas enmiendas tiene la Constitución? (27). ¿Cómo se llaman las primeras diez enmiendas? (La Carta de Derechos). Nombre un derecho de la Primera Enmienda. (Libertad de expresión, religión, reunión, prensa, petición al gobierno).'),
('civics-3', 'civics-prep', 2, 3, 'Government Structure (Q29-57)', 'Estructura del Gobierno (P29-57)',
 'Key questions: How many US Senators are there? (100). How many years is a Senate term? (6). How many voting members in the House? (435). How many years is a House term? (2). Who is the Commander in Chief of the military? (The President). How many justices on the Supreme Court? (9). Who is the current Chief Justice? (Check current). What are the two major political parties? (Democratic and Republican). What is the highest court? (The Supreme Court).',
 'Preguntas clave: ¿Cuántos senadores hay? (100). ¿Cuántos años dura un período senatorial? (6). ¿Cuántos miembros votantes hay en la Cámara? (435). ¿Cuántos años dura un período en la Cámara? (2). ¿Quién es el Comandante en Jefe del ejército? (El Presidente). ¿Cuántos jueces hay en la Corte Suprema? (9). ¿Quién es el actual Presidente de la Corte? (Verifique actual). ¿Cuáles son los dos partidos políticos principales? (Demócrata y Republicano). ¿Cuál es la corte más alta? (La Corte Suprema).'),
('civics-4', 'civics-prep', 3, 4, 'History (Q58-87)', 'Historia (P58-87)',
 'Key questions: What is one reason colonists came to America? (Freedom, political liberty, religious freedom, economic opportunity). When was the Declaration of Independence adopted? (July 4, 1776). What did the Declaration of Independence do? (Declared independence from Great Britain). What territory did the US buy from France in 1803? (Louisiana). Name one war fought by the US in the 1800s. (Civil War). What did the Emancipation Proclamation do? (Freed the slaves in the Confederacy).',
 'Preguntas clave: ¿Cuál es una razón por la que los colonos vinieron a América? (Libertad, libertad política, libertad religiosa, oportunidad económica). ¿Cuándo se adoptó la Declaración de Independencia? (4 de julio de 1776). ¿Qué hizo la Declaración de Independencia? (Declaró la independencia de Gran Bretaña). ¿Qué territorio compró EE.UU. de Francia en 1803? (Luisiana). Nombre una guerra librada por EE.UU. en el siglo XIX. (Guerra Civil). ¿Qué hizo la Proclamación de Emancipación? (Liberó a los esclavos en la Confederación).'),
('civics-5', 'civics-prep', 4, 5, 'Geography & Symbols (Q88-100)', 'Geografía y Símbolos (P88-100)',
 'Key questions: Name one US territory. (Puerto Rico, US Virgin Islands, American Samoa, Northern Mariana Islands, Guam). Name one state that borders Canada. (Maine, New Hampshire, Vermont, New York, Pennsylvania, Ohio, Michigan, Minnesota, North Dakota, Montana, Idaho, Washington, Alaska). Why does the flag have 13 stripes? (The original 13 colonies). Why does the flag have 50 stars? (One for each state). What is the capital of the US? (Washington, D.C.).',
 'Preguntas clave: Nombre un territorio de EE.UU. (Puerto Rico, Islas Vírgenes, Samoa Americana, Islas Marianas del Norte, Guam). Nombre un estado que limita con Canadá. (Maine, New Hampshire, Vermont, New York, Pennsylvania, Ohio, Michigan, Minnesota, North Dakota, Montana, Idaho, Washington, Alaska). ¿Por qué la bandera tiene 13 franjas? (Las 13 colonias originales). ¿Por qué la bandera tiene 50 estrellas? (Una por cada estado). ¿Cuál es la capital de EE.UU.? (Washington, D.C.).')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, title_es = EXCLUDED.title_es, text = EXCLUDED.text, text_es = EXCLUDED.text_es;


-- ============================================================
-- CANCELLATION OF REMOVAL (INA §240A)
-- ============================================================

INSERT INTO laws (id, title, title_es, category, type, article_count, searchable_text, searchable_text_es)
VALUES
('ina-240a', 'INA §240A - Cancellation of Removal', 'INA §240A - Cancelación de Remoción', 'deportation', 'Federal Statute', 4,
 'cancellation removal 10 years physical presence good moral character exceptional hardship',
 'cancelación remoción 10 años presencia física buen carácter moral dificultad excepcional')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, title_es = EXCLUDED.title_es, article_count = EXCLUDED.article_count;

INSERT INTO law_items (id, law_id, index, number, title, title_es, text, text_es) VALUES
('ina-240a-1', 'ina-240a', 0, 1, 'For Permanent Residents', 'Para Residentes Permanentes',
 'A permanent resident may have removal cancelled if: (1) has been an LPR for at least 5 years; (2) has resided continuously in the US for at least 7 years after admission; and (3) has not been convicted of an aggravated felony. If granted, the alien retains LPR status. The "stop-time rule" means any qualifying offense stops the accumulation of the 7-year period.',
 'Un residente permanente puede tener la remoción cancelada si: (1) ha sido LPR por al menos 5 años; (2) ha residido continuamente en EE.UU. por al menos 7 años después de la admisión; y (3) no ha sido condenado por un delito agravado. Si se otorga, el extranjero mantiene su estatus de LPR. La "regla de detención del tiempo" significa que cualquier delito calificante detiene la acumulación del período de 7 años.'),
('ina-240a-2', 'ina-240a', 1, 2, 'For Nonpermanent Residents (10-Year Rule)', 'Para No Residentes Permanentes (Regla de 10 Años)',
 'A non-LPR may have removal cancelled and status adjusted if: (1) continuously physically present in the US for at least 10 years; (2) good moral character during those 10 years; (3) not convicted of certain criminal offenses; and (4) removal would result in "exceptional and extremely unusual hardship" to the alien''s US citizen or LPR spouse, parent, or child. Only 4,000 grants per year are available.',
 'Un no-LPR puede tener la remoción cancelada y su estatus ajustado si: (1) ha estado continuamente físicamente presente en EE.UU. por al menos 10 años; (2) buen carácter moral durante esos 10 años; (3) no ha sido condenado por ciertos delitos penales; y (4) la remoción resultaría en "dificultad excepcional y extremadamente inusual" para el cónyuge, padre o hijo ciudadano o LPR del extranjero. Solo 4,000 otorgamientos por año están disponibles.'),
('ina-240a-3', 'ina-240a', 2, 3, 'Exceptional and Extremely Unusual Hardship', 'Dificultad Excepcional y Extremadamente Inusual',
 'This is a very high standard. Courts consider: medical conditions of qualifying relatives that cannot be treated in the home country, educational impact on US citizen children, financial devastation, country conditions in the home country. Important: the hardship must be to the qualifying relative (USC/LPR spouse, parent, or child), NOT to the applicant. Hardship to the applicant alone is insufficient.',
 'Este es un estándar muy alto. Los tribunales consideran: condiciones médicas de familiares calificados que no pueden ser tratadas en el país de origen, impacto educativo en hijos ciudadanos, devastación financiera, condiciones del país de origen. Importante: la dificultad debe ser para el familiar calificado (cónyuge, padre o hijo ciudadano/LPR), NO para el solicitante. La dificultad solo para el solicitante es insuficiente.'),
('ina-240a-4', 'ina-240a', 3, 4, 'Stop-Time Rule', 'Regla de Detención del Tiempo',
 'Under INA §240A(d), the period of continuous physical presence or continuous residence is deemed to end when: (1) the alien is served a Notice to Appear (NTA); or (2) the alien commits certain criminal offenses (regardless of when convicted). This means if you receive an NTA after 8 years, you cannot count any time after that toward the 10-year requirement. Plan accordingly.',
 'Bajo la INA §240A(d), el período de presencia física continua o residencia continua se considera terminado cuando: (1) el extranjero recibe una Notificación de Comparecencia (NTA); o (2) el extranjero comete ciertos delitos penales (independientemente de cuándo sea condenado). Esto significa que si recibe una NTA después de 8 años, no puede contar ningún tiempo después de eso hacia el requisito de 10 años. Planifique en consecuencia.')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, title_es = EXCLUDED.title_es, text = EXCLUDED.text, text_es = EXCLUDED.text_es;


-- ============================================================
-- Update system_metadata
-- ============================================================

UPDATE system_metadata
SET laws_last_updated = NOW(), last_upload_count = 38
WHERE id = 'main';
