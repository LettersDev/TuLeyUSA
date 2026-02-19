-- ============================================================
-- laws_data.sql — MigraGuide USA
-- Comprehensive US Immigration Law Data (Bilingual EN/ES)
-- Run in Supabase SQL Editor to populate the database
-- ============================================================

-- STEP 1: Add bilingual columns if they don't exist
ALTER TABLE laws ADD COLUMN IF NOT EXISTS title_es TEXT;
ALTER TABLE laws ADD COLUMN IF NOT EXISTS searchable_text_es TEXT;
ALTER TABLE law_items ADD COLUMN IF NOT EXISTS title_es TEXT;
ALTER TABLE law_items ADD COLUMN IF NOT EXISTS text_es TEXT;

-- ============================================================
-- ASYLUM & REFUGEE PROTECTION
-- ============================================================

INSERT INTO laws (id, title, title_es, category, type, article_count, searchable_text, searchable_text_es)
VALUES
('ina-208', 'INA §208 - Asylum', 'INA §208 - Asilo', 'asylum', 'Federal Statute', 8,
 'asylum refugee protection persecution political opinion religion nationality',
 'asilo refugiado protección persecución opinión política religión nacionalidad')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, title_es = EXCLUDED.title_es, article_count = EXCLUDED.article_count;

INSERT INTO law_items (id, law_id, index, number, title, title_es, text, text_es) VALUES
('ina-208-1', 'ina-208', 0, 1, 'Right to Apply for Asylum', 'Derecho a Solicitar Asilo',
 'Any alien who is physically present in the United States or who arrives in the United States, irrespective of such alien''s status, may apply for asylum in accordance with this section or, where applicable, section 235(b).',
 'Cualquier extranjero que esté físicamente presente en los Estados Unidos o que llegue a los Estados Unidos, independientemente de su estatus, puede solicitar asilo de acuerdo con esta sección o, cuando sea aplicable, la sección 235(b).'),

('ina-208-2', 'ina-208', 1, 2, 'One-Year Filing Deadline', 'Plazo de Presentación de Un Año',
 'An alien must demonstrate by clear and convincing evidence that the application has been filed within 1 year after the date of the alien''s arrival in the United States. Exceptions exist for changed circumstances or extraordinary circumstances related to the delay.',
 'Un extranjero debe demostrar con evidencia clara y convincente que la solicitud ha sido presentada dentro de 1 año después de la fecha de llegada del extranjero a los Estados Unidos. Existen excepciones por circunstancias cambiadas o circunstancias extraordinarias relacionadas con el retraso.'),

('ina-208-3', 'ina-208', 2, 3, 'Conditions for Granting Asylum', 'Condiciones para Otorgar Asilo',
 'The Attorney General may grant asylum to an alien who demonstrates that race, religion, nationality, membership in a particular social group, or political opinion was or will be at least one central reason for persecuting the applicant.',
 'El Fiscal General puede conceder asilo a un extranjero que demuestre que la raza, religión, nacionalidad, pertenencia a un grupo social particular u opinión política fue o será al menos una razón central para perseguir al solicitante.'),

('ina-208-4', 'ina-208', 3, 4, 'Bars to Asylum', 'Impedimentos al Asilo',
 'An alien is ineligible for asylum if: (1) ordered removed under the previous asylum process; (2) may be removed to a safe third country; (3) has been convicted of a particularly serious crime; (4) committed a serious nonpolitical crime outside the US; (5) is a persecutor of others; or (6) is a danger to the security of the United States.',
 'Un extranjero no es elegible para asilo si: (1) fue ordenado para ser removido bajo el proceso de asilo anterior; (2) puede ser removido a un tercer país seguro; (3) ha sido condenado por un crimen particularmente grave; (4) cometió un crimen serio no político fuera de EE.UU.; (5) es un perseguidor de otros; o (6) es un peligro para la seguridad de los Estados Unidos.'),

('ina-208-5', 'ina-208', 4, 5, 'Employment Authorization', 'Autorización de Empleo',
 'An applicant for asylum is not entitled to employment authorization. However, if the applicant is not otherwise eligible for employment authorization, the applicant shall not be granted such authorization prior to 180 days after the date of filing of the application for asylum.',
 'Un solicitante de asilo no tiene derecho a autorización de empleo. Sin embargo, si el solicitante no es elegible de otra manera para autorización de empleo, no se le otorgará dicha autorización antes de 180 días después de la fecha de presentación de la solicitud de asilo.'),

('ina-208-6', 'ina-208', 5, 6, 'Asylum Status Benefits', 'Beneficios del Estatus de Asilo',
 'An alien granted asylum is authorized for employment in the United States and may receive travel documents. The spouse and children of an alien granted asylum may also be granted asylum if accompanying or following to join the principal applicant.',
 'Un extranjero al que se le concede asilo está autorizado para empleo en los Estados Unidos y puede recibir documentos de viaje. El cónyuge e hijos de un extranjero al que se le concede asilo también pueden recibir asilo si acompañan o siguen para unirse con el solicitante principal.'),

('ina-208-7', 'ina-208', 6, 7, 'Termination of Asylum', 'Terminación del Asilo',
 'Asylum granted may be terminated if the alien no longer meets the conditions for asylum due to a fundamental change in circumstances, or if the alien meets any of the conditions for ineligibility described in the bars to asylum.',
 'El asilo otorgado puede ser terminado si el extranjero ya no cumple con las condiciones para el asilo debido a un cambio fundamental en las circunstancias, o si el extranjero cumple con cualquiera de las condiciones de inelegibilidad descritas en los impedimentos al asilo.'),

('ina-208-8', 'ina-208', 7, 8, 'Credible Fear Screening', 'Evaluación de Miedo Creíble',
 'An alien subject to expedited removal who indicates an intention to apply for asylum or a fear of persecution shall be referred for an interview by an asylum officer to determine whether the alien has a credible fear of persecution.',
 'Un extranjero sujeto a remoción expedita que indique la intención de solicitar asilo o un temor a la persecución será referido para una entrevista con un oficial de asilo para determinar si el extranjero tiene un temor creíble de persecución.')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, title_es = EXCLUDED.title_es, text = EXCLUDED.text, text_es = EXCLUDED.text_es;


-- ============================================================
-- TEMPORARY PROTECTED STATUS (TPS)
-- ============================================================

INSERT INTO laws (id, title, title_es, category, type, article_count, searchable_text, searchable_text_es)
VALUES
('ina-244', 'INA §244 - Temporary Protected Status (TPS)', 'INA §244 - Estatus de Protección Temporal (TPS)', 'tps', 'Federal Statute', 6,
 'temporary protected status TPS designation country conditions natural disaster armed conflict',
 'estatus protección temporal TPS designación país condiciones desastre natural conflicto armado')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, title_es = EXCLUDED.title_es, article_count = EXCLUDED.article_count;

INSERT INTO law_items (id, law_id, index, number, title, title_es, text, text_es) VALUES
('ina-244-1', 'ina-244', 0, 1, 'TPS Designation', 'Designación de TPS',
 'The Secretary of Homeland Security may designate a country for TPS if: (1) there is an ongoing armed conflict that would pose a serious threat to the personal safety of returned nationals; (2) there has been an earthquake, flood, epidemic, or other environmental disaster resulting in a substantial temporary disruption of living conditions; or (3) there exist extraordinary and temporary conditions in the country that prevent nationals from returning safely.',
 'El Secretario de Seguridad Nacional puede designar un país para TPS si: (1) hay un conflicto armado en curso que representaría una amenaza seria para la seguridad personal de los nacionales retornados; (2) ha habido un terremoto, inundación, epidemia u otro desastre ambiental que resulta en una interrupción sustancial temporal de las condiciones de vida; o (3) existen condiciones extraordinarias y temporales en el país que impiden que los nacionales regresen de manera segura.'),

('ina-244-2', 'ina-244', 1, 2, 'Eligibility Requirements', 'Requisitos de Elegibilidad',
 'To be eligible for TPS, an alien must: (1) be a national of a designated country or a person without nationality who last habitually resided in that country; (2) file during the registration period; (3) have been continuously present in the US since the designation date; (4) have been continuously residing in the US since a specified date; and (5) not be inadmissible or ineligible due to criminal bars.',
 'Para ser elegible para TPS, un extranjero debe: (1) ser nacional de un país designado o una persona sin nacionalidad que residía habitualmente en ese país; (2) presentar la solicitud durante el período de registro; (3) haber estado continuamente presente en EE.UU. desde la fecha de designación; (4) haber residido continuamente en EE.UU. desde una fecha especificada; y (5) no ser inadmisible o inelegible debido a impedimentos penales.'),

('ina-244-3', 'ina-244', 2, 3, 'Benefits of TPS', 'Beneficios del TPS',
 'A TPS beneficiary: (1) shall not be detained or removed during the period of status; (2) is authorized for employment during TPS; (3) may obtain travel authorization. TPS does not lead to permanent resident status but protects from deportation during the designation period.',
 'Un beneficiario de TPS: (1) no será detenido ni removido durante el período de estatus; (2) está autorizado para empleo durante el TPS; (3) puede obtener autorización de viaje. El TPS no conduce al estatus de residente permanente pero protege de la deportación durante el período de designación.'),

('ina-244-4', 'ina-244', 3, 4, 'Duration and Redesignation', 'Duración y Redesignación',
 'TPS is initially designated for 6 to 18 months. At least 60 days before the end of the designation period, the Secretary must review conditions in the country to determine whether the conditions for designation continue to be met. The designation may be extended if conditions persist.',
 'El TPS se designa inicialmente por 6 a 18 meses. Al menos 60 días antes del final del período de designación, el Secretario debe revisar las condiciones en el país para determinar si las condiciones para la designación continúan cumpliéndose. La designación puede ser extendida si las condiciones persisten.'),

('ina-244-5', 'ina-244', 4, 5, 'Criminal Bars to TPS', 'Impedimentos Penales al TPS',
 'An alien is ineligible for TPS if convicted of any felony or two or more misdemeanors committed in the United States, or if the alien is found inadmissible on certain criminal, national security, or terrorist-related grounds.',
 'Un extranjero no es elegible para TPS si ha sido condenado por un delito grave o dos o más delitos menores cometidos en los Estados Unidos, o si el extranjero es considerado inadmisible por ciertos motivos penales, de seguridad nacional o relacionados con terrorismo.'),

('ina-244-6', 'ina-244', 5, 6, 'Currently Designated Countries', 'Países Actualmente Designados',
 'As of recent designations, countries with active TPS include: El Salvador, Haiti, Honduras, Nepal, Nicaragua, Somalia, South Sudan, Sudan, Syria, Venezuela, Yemen, Ukraine, Afghanistan, Cameroon, Ethiopia, Myanmar (Burma), and others. Check USCIS.gov for current designations.',
 'Según las designaciones recientes, los países con TPS activo incluyen: El Salvador, Haití, Honduras, Nepal, Nicaragua, Somalia, Sudán del Sur, Sudán, Siria, Venezuela, Yemen, Ucrania, Afganistán, Camerún, Etiopía, Myanmar (Birmania), y otros. Consulte USCIS.gov para las designaciones actuales.')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, title_es = EXCLUDED.title_es, text = EXCLUDED.text, text_es = EXCLUDED.text_es;


-- ============================================================
-- DEPORTATION & REMOVAL
-- ============================================================

INSERT INTO laws (id, title, title_es, category, type, article_count, searchable_text, searchable_text_es)
VALUES
('ina-240', 'INA §240 - Removal Proceedings', 'INA §240 - Procedimientos de Remoción', 'deportation', 'Federal Statute', 6,
 'removal proceedings deportation immigration court hearing judge defense attorney',
 'procedimientos de remoción deportación corte inmigración audiencia juez defensa abogado')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, title_es = EXCLUDED.title_es, article_count = EXCLUDED.article_count;

INSERT INTO law_items (id, law_id, index, number, title, title_es, text, text_es) VALUES
('ina-240-1', 'ina-240', 0, 1, 'Notice to Appear (NTA)', 'Notificación de Comparecencia (NTA)',
 'An alien placed in removal proceedings is served a Notice to Appear (NTA) that specifies: (1) the nature of the proceedings; (2) the legal authority for the proceedings; (3) the acts or conduct alleged; (4) the charges against the alien and statutory provisions alleged to have been violated; (5) the right to be represented by counsel at no expense to the government; and (6) the time and place of the hearing.',
 'Un extranjero colocado en procedimientos de remoción recibe una Notificación de Comparecencia (NTA) que especifica: (1) la naturaleza de los procedimientos; (2) la autoridad legal para los procedimientos; (3) los actos o conducta alegados; (4) los cargos contra el extranjero y las disposiciones legales presuntamente violadas; (5) el derecho a ser representado por un abogado sin costo para el gobierno; y (6) el tiempo y lugar de la audiencia.'),

('ina-240-2', 'ina-240', 1, 2, 'Right to Counsel', 'Derecho a Abogado',
 'The alien shall have the privilege of being represented, at no expense to the Government, by counsel of the alien''s choosing who is authorized to practice in such proceedings. The alien shall have a reasonable opportunity to examine the evidence against the alien, to present evidence on the alien''s own behalf, and to cross-examine witnesses.',
 'El extranjero tendrá el privilegio de ser representado, sin costo para el Gobierno, por un abogado de su elección que esté autorizado para practicar en dichos procedimientos. El extranjero tendrá una oportunidad razonable de examinar la evidencia en su contra, presentar evidencia a su favor y contrainterrogar a los testigos.'),

('ina-240-3', 'ina-240', 2, 3, 'Burden of Proof', 'Carga de la Prueba',
 'In removal proceedings, the government bears the burden of establishing by clear and convincing evidence that, in the case of an alien who has been admitted to the United States, the alien is deportable. An alien applying for admission must establish that the alien is clearly and beyond doubt entitled to be admitted and is not inadmissible.',
 'En procedimientos de remoción, el gobierno tiene la carga de establecer con evidencia clara y convincente que, en el caso de un extranjero que ha sido admitido en los Estados Unidos, el extranjero es deportable. Un extranjero que solicita admisión debe establecer que tiene clara e indudablemente derecho a ser admitido y no es inadmisible.'),

('ina-240-4', 'ina-240', 3, 4, 'Relief from Removal', 'Alivio de la Remoción',
 'An alien may apply for various forms of relief from removal during proceedings, including: (1) asylum; (2) withholding of removal; (3) cancellation of removal; (4) adjustment of status; (5) voluntary departure; and (6) protection under the Convention Against Torture (CAT).',
 'Un extranjero puede solicitar varias formas de alivio de la remoción durante los procedimientos, incluyendo: (1) asilo; (2) retención de remoción; (3) cancelación de remoción; (4) ajuste de estatus; (5) salida voluntaria; y (6) protección bajo la Convención contra la Tortura (CAT).'),

('ina-240-5', 'ina-240', 4, 5, 'Cancellation of Removal for Nonpermanent Residents', 'Cancelación de Remoción para No Residentes Permanentes',
 'The Attorney General may cancel removal and adjust the status of an alien who: (1) has been physically present for a continuous period of not less than 10 years; (2) has been a person of good moral character during such period; (3) has not been convicted of certain offenses; and (4) establishes that removal would result in exceptional and extremely unusual hardship to the alien''s US citizen or permanent resident spouse, parent, or child.',
 'El Fiscal General puede cancelar la remoción y ajustar el estatus de un extranjero que: (1) ha estado físicamente presente por un período continuo de no menos de 10 años; (2) ha sido una persona de buen carácter moral durante dicho período; (3) no ha sido condenado por ciertos delitos; y (4) establece que la remoción resultaría en una dificultad excepcional y extremadamente inusual para su cónyuge, padre o hijo ciudadano estadounidense o residente permanente.'),

('ina-240-6', 'ina-240', 5, 6, 'Voluntary Departure', 'Salida Voluntaria',
 'The immigration judge may permit an alien to voluntarily depart the United States at the alien''s own expense. If granted before the conclusion of proceedings, the alien has up to 120 days to depart. If granted after proceedings, the alien has up to 60 days. Failure to voluntarily depart results in a fine and a 10-year bar to certain forms of relief.',
 'El juez de inmigración puede permitir que un extranjero salga voluntariamente de los Estados Unidos a sus propias expensas. Si se concede antes de la conclusión de los procedimientos, el extranjero tiene hasta 120 días para partir. Si se concede después de los procedimientos, el extranjero tiene hasta 60 días. El incumplimiento de la salida voluntaria resulta en una multa y una prohibición de 10 años para ciertas formas de alivio.')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, title_es = EXCLUDED.title_es, text = EXCLUDED.text, text_es = EXCLUDED.text_es;


-- ============================================================
-- CITIZENSHIP & NATURALIZATION
-- ============================================================

INSERT INTO laws (id, title, title_es, category, type, article_count, searchable_text, searchable_text_es)
VALUES
('usc-1427', '8 USC §1427 - Requirements for Naturalization', '8 USC §1427 - Requisitos para la Naturalización', 'citizenship', 'Federal Statute', 6,
 'naturalization citizenship requirements residency good moral character english civics test',
 'naturalización ciudadanía requisitos residencia buen carácter moral inglés examen cívico')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, title_es = EXCLUDED.title_es, article_count = EXCLUDED.article_count;

INSERT INTO law_items (id, law_id, index, number, title, title_es, text, text_es) VALUES
('usc-1427-1', 'usc-1427', 0, 1, 'General Requirements', 'Requisitos Generales',
 'No person shall be naturalized unless such applicant: (1) has resided continuously as a lawful permanent resident for at least 5 years; (2) has been physically present for at least 30 months during that 5-year period; (3) has resided for at least 3 months in the state or USCIS district where the application is filed.',
 'Ninguna persona será naturalizada a menos que dicho solicitante: (1) haya residido continuamente como residente permanente legal por al menos 5 años; (2) haya estado físicamente presente por al menos 30 meses durante ese período de 5 años; (3) haya residido por al menos 3 meses en el estado o distrito de USCIS donde se presenta la solicitud.'),

('usc-1427-2', 'usc-1427', 1, 2, 'Spouse of US Citizen (3-Year Rule)', 'Cónyuge de Ciudadano (Regla de 3 Años)',
 'A lawful permanent resident who has been married to and living with a US citizen spouse for at least 3 years may apply for naturalization after only 3 years of permanent residence, rather than the standard 5 years. The applicant must have been physically present for at least 18 months during that period.',
 'Un residente permanente legal que ha estado casado y viviendo con un cónyuge ciudadano estadounidense por al menos 3 años puede solicitar la naturalización después de solo 3 años de residencia permanente, en lugar de los 5 años estándar. El solicitante debe haber estado físicamente presente por al menos 18 meses durante ese período.'),

('usc-1427-3', 'usc-1427', 2, 3, 'Good Moral Character', 'Buen Carácter Moral',
 'The applicant must demonstrate good moral character during the statutory period. Bars to good moral character include: habitual drunkard, gambling conviction, conviction of an aggravated felony, drug offenses, prostitution, smuggling aliens, and giving false testimony for immigration benefits.',
 'El solicitante debe demostrar buen carácter moral durante el período legal. Los impedimentos al buen carácter moral incluyen: ebriedad habitual, condena por juego, condena por delito agravado, delitos de drogas, prostitución, tráfico de extranjeros y dar falso testimonio para beneficios de inmigración.'),

('usc-1427-4', 'usc-1427', 3, 4, 'English Language Requirement', 'Requisito del Idioma Inglés',
 'The applicant must demonstrate an understanding of the English language, including the ability to read, write, and speak words in ordinary usage. Exceptions: persons over 50 who have lived in the US for 20+ years, persons over 55 who have lived in the US for 15+ years, and persons with qualifying physical or developmental disabilities.',
 'El solicitante debe demostrar comprensión del idioma inglés, incluyendo la capacidad de leer, escribir y hablar palabras de uso ordinario. Excepciones: personas mayores de 50 años que han vivido en EE.UU. por 20+ años, personas mayores de 55 años que han vivido en EE.UU. por 15+ años, y personas con discapacidades físicas o de desarrollo calificadas.'),

('usc-1427-5', 'usc-1427', 4, 5, 'Civics Test', 'Examen Cívico',
 'The applicant must demonstrate knowledge and understanding of the fundamentals of United States history and government. The civics test consists of questions about U.S. government, history, and integrated civics. The applicant must correctly answer 6 out of 10 questions selected from a list of 100 possible questions.',
 'El solicitante debe demostrar conocimiento y comprensión de los fundamentos de la historia y el gobierno de los Estados Unidos. El examen cívico consiste en preguntas sobre el gobierno de EE.UU., historia y educación cívica integrada. El solicitante debe responder correctamente 6 de 10 preguntas seleccionadas de una lista de 100 posibles preguntas.'),

('usc-1427-6', 'usc-1427', 5, 6, 'Oath of Allegiance', 'Juramento de Lealtad',
 'The final step in naturalization is taking the Oath of Allegiance to the United States. The applicant renounces allegiance to any foreign state, supports and defends the Constitution and laws of the United States, and bears arms or performs noncombatant service or civilian work when required by law.',
 'El paso final en la naturalización es tomar el Juramento de Lealtad a los Estados Unidos. El solicitante renuncia a la lealtad a cualquier estado extranjero, apoya y defiende la Constitución y las leyes de los Estados Unidos, y porta armas o realiza servicio no combatiente o trabajo civil cuando lo requiera la ley.')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, title_es = EXCLUDED.title_es, text = EXCLUDED.text, text_es = EXCLUDED.text_es;


-- ============================================================
-- DACA (Deferred Action for Childhood Arrivals)
-- ============================================================

INSERT INTO laws (id, title, title_es, category, type, article_count, searchable_text, searchable_text_es)
VALUES
('daca-policy', 'DACA - Deferred Action for Childhood Arrivals', 'DACA - Acción Diferida para los Llegados en la Infancia', 'daca', 'Executive Policy', 5,
 'DACA deferred action childhood arrivals dreamers undocumented young immigrants',
 'DACA acción diferida infancia soñadores dreamers indocumentados jóvenes inmigrantes')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, title_es = EXCLUDED.title_es, article_count = EXCLUDED.article_count;

INSERT INTO law_items (id, law_id, index, number, title, title_es, text, text_es) VALUES
('daca-1', 'daca-policy', 0, 1, 'DACA Eligibility', 'Elegibilidad para DACA',
 'To be eligible for DACA, an individual must: (1) have been under age 31 as of June 15, 2012; (2) have come to the US before turning 16; (3) have continuously resided in the US since June 15, 2007; (4) have been physically present in the US on June 15, 2012; (5) have no lawful immigration status on June 15, 2012; (6) be currently in school, have graduated from high school, obtained a GED, or be an honorably discharged veteran.',
 'Para ser elegible para DACA, una persona debe: (1) haber tenido menos de 31 años al 15 de junio de 2012; (2) haber llegado a EE.UU. antes de cumplir 16 años; (3) haber residido continuamente en EE.UU. desde el 15 de junio de 2007; (4) haber estado físicamente presente en EE.UU. el 15 de junio de 2012; (5) no tener estatus migratorio legal el 15 de junio de 2012; (6) estar actualmente en la escuela, haberse graduado de la secundaria, obtenido un GED, o ser un veterano dado de baja con honor.'),

('daca-2', 'daca-policy', 1, 2, 'DACA Benefits', 'Beneficios de DACA',
 'DACA recipients receive: (1) protection from deportation for a renewable 2-year period; (2) employment authorization (work permit); (3) the ability to obtain a Social Security number; (4) eligibility for a driver''s license in all states. DACA does NOT provide lawful immigration status or a path to citizenship.',
 'Los beneficiarios de DACA reciben: (1) protección contra la deportación por un período renovable de 2 años; (2) autorización de empleo (permiso de trabajo); (3) la capacidad de obtener un número de Seguro Social; (4) elegibilidad para una licencia de conducir en todos los estados. DACA NO proporciona estatus migratorio legal ni un camino a la ciudadanía.'),

('daca-3', 'daca-policy', 2, 3, 'Criminal Bars', 'Impedimentos Penales',
 'An applicant is ineligible for DACA if convicted of: (1) a felony; (2) a significant misdemeanor (such as DUI, domestic violence, sexual abuse, drug distribution, firearms offenses, or burglary); or (3) three or more other misdemeanors not occurring on the same date and not arising from the same act.',
 'Un solicitante no es elegible para DACA si ha sido condenado por: (1) un delito grave; (2) un delito menor significativo (como DUI, violencia doméstica, abuso sexual, distribución de drogas, delitos de armas de fuego o robo); o (3) tres o más otros delitos menores que no ocurrieron en la misma fecha y no surgieron del mismo acto.'),

('daca-4', 'daca-policy', 3, 4, 'Renewal Process', 'Proceso de Renovación',
 'DACA recipients must renew their status every two years by filing Form I-821D. USCIS recommends filing renewal requests between 150 and 120 days before the current period of deferred action expires. Failure to timely renew may result in a gap in work authorization and protection from deportation.',
 'Los beneficiarios de DACA deben renovar su estatus cada dos años presentando el Formulario I-821D. USCIS recomienda presentar solicitudes de renovación entre 150 y 120 días antes de que expire el período actual de acción diferida. El no renovar a tiempo puede resultar en una brecha en la autorización de trabajo y la protección contra la deportación.'),

('daca-5', 'daca-policy', 4, 5, 'Current Legal Status', 'Estado Legal Actual',
 'DACA has faced multiple legal challenges. As of recent court rulings, USCIS continues to accept and process DACA renewal applications but has been barred from accepting new (first-time) applications. The program''s future depends on ongoing litigation and potential congressional action. Check USCIS.gov for the most current information.',
 'DACA ha enfrentado múltiples desafíos legales. Según las decisiones judiciales recientes, USCIS continúa aceptando y procesando solicitudes de renovación de DACA pero se le ha prohibido aceptar nuevas solicitudes (por primera vez). El futuro del programa depende del litigio en curso y la posible acción del Congreso. Consulte USCIS.gov para la información más actual.')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, title_es = EXCLUDED.title_es, text = EXCLUDED.text, text_es = EXCLUDED.text_es;


-- ============================================================
-- VISA TYPES
-- ============================================================

INSERT INTO laws (id, title, title_es, category, type, article_count, searchable_text, searchable_text_es)
VALUES
('visa-family', 'Family-Based Immigration Visas', 'Visas de Inmigración Basadas en Familia', 'family', 'Immigration Category', 5,
 'family visa petition spouse parent child sibling green card immigrant preference',
 'visa familia petición cónyuge padre hijo hermano tarjeta verde inmigrante preferencia'),

('visa-work', 'Employment-Based Visas', 'Visas Basadas en Empleo', 'work', 'Immigration Category', 5,
 'employment visa H-1B L-1 O-1 work permit labor certification employer sponsor',
 'empleo visa H-1B L-1 O-1 permiso trabajo certificación laboral empleador patrocinador'),

('visa-u', 'Visa U - Crime Victims', 'Visa U - Víctimas de Crimen', 'visas', 'Humanitarian Visa', 4,
 'U visa crime victims domestic violence trafficking protection law enforcement cooperation',
 'visa U víctimas crimen violencia doméstica tráfico protección cooperación policía'),

('visa-t', 'Visa T - Trafficking Victims', 'Visa T - Víctimas de Tráfico de Personas', 'visas', 'Humanitarian Visa', 4,
 'T visa trafficking victims human trafficking labor trafficking sex trafficking protection',
 'visa T víctimas tráfico personas tráfico humano tráfico laboral tráfico sexual protección')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, title_es = EXCLUDED.title_es, article_count = EXCLUDED.article_count;

-- Family-Based Visas
INSERT INTO law_items (id, law_id, index, number, title, title_es, text, text_es) VALUES
('visa-fam-1', 'visa-family', 0, 1, 'Immediate Relatives', 'Familiares Inmediatos',
 'US citizens can petition for immediate relatives with no annual numerical limits: (1) Spouse (IR-1/CR-1); (2) Unmarried children under 21 (IR-2); (3) Parents (IR-5, if petitioner is 21+). Immediate relative petitions are not subject to per-country limits or preference category wait times.',
 'Los ciudadanos estadounidenses pueden solicitar familiares inmediatos sin límites numéricos anuales: (1) Cónyuge (IR-1/CR-1); (2) Hijos solteros menores de 21 años (IR-2); (3) Padres (IR-5, si el peticionario tiene 21+). Las peticiones de familiares inmediatos no están sujetas a límites por país ni a tiempos de espera de categorías de preferencia.'),

('visa-fam-2', 'visa-family', 1, 2, 'Family Preference Categories', 'Categorías de Preferencia Familiar',
 'Family preference categories have annual limits: F1: Unmarried adult children of US citizens (23,400/year). F2A: Spouses and children of permanent residents (87,934/year). F2B: Unmarried adult children of permanent residents (26,266/year). F3: Married adult children of US citizens (23,400/year). F4: Siblings of adult US citizens (65,000/year). Wait times vary significantly by country.',
 'Las categorías de preferencia familiar tienen límites anuales: F1: Hijos adultos solteros de ciudadanos (23,400/año). F2A: Cónyuges e hijos de residentes permanentes (87,934/año). F2B: Hijos adultos solteros de residentes permanentes (26,266/año). F3: Hijos adultos casados de ciudadanos (23,400/año). F4: Hermanos de ciudadanos adultos (65,000/año). Los tiempos de espera varían significativamente por país.'),

('visa-fam-3', 'visa-family', 2, 3, 'I-130 Petition', 'Petición I-130',
 'The I-130 (Petition for Alien Relative) is the form used to establish the qualifying relationship between a US citizen or permanent resident and their foreign relative. The petitioner must prove the relationship through documentary evidence such as marriage certificates, birth certificates, and adoption documents.',
 'El I-130 (Petición para Familiar Extranjero) es el formulario utilizado para establecer la relación calificada entre un ciudadano o residente permanente y su familiar extranjero. El peticionario debe comprobar la relación mediante evidencia documental como certificados de matrimonio, actas de nacimiento y documentos de adopción.'),

('visa-fam-4', 'visa-family', 3, 4, 'Adjustment of Status vs Consular Processing', 'Ajuste de Estatus vs Procesamiento Consular',
 'After I-130 approval, the beneficiary can obtain a green card through: (1) Adjustment of Status (Form I-485) if already in the US; or (2) Consular Processing at a US Embassy/Consulate abroad (Form DS-260). Adjustment of status requires lawful entry and no bars to adjustment.',
 'Después de la aprobación del I-130, el beneficiario puede obtener una tarjeta verde a través de: (1) Ajuste de Estatus (Formulario I-485) si ya está en EE.UU.; o (2) Procesamiento Consular en una Embajada/Consulado de EE.UU. en el extranjero (Formulario DS-260). El ajuste de estatus requiere entrada legal y no tener impedimentos para el ajuste.'),

('visa-fam-5', 'visa-family', 4, 5, 'Unlawful Presence Bars', 'Prohibiciones por Presencia Ilegal',
 'Individuals who have accrued 180 days to 1 year of unlawful presence face a 3-year bar from readmission. Those with more than 1 year face a 10-year bar. The I-601A provisional unlawful presence waiver may be available for immediate relatives of US citizens to forgive these bars before departing for consular processing.',
 'Las personas que han acumulado de 180 días a 1 año de presencia ilegal enfrentan una prohibición de 3 años para readmisión. Quienes tienen más de 1 año enfrentan una prohibición de 10 años. El perdón provisional de presencia ilegal I-601A puede estar disponible para familiares inmediatos de ciudadanos para perdonar estas prohibiciones antes de partir al procesamiento consular.')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, title_es = EXCLUDED.title_es, text = EXCLUDED.text, text_es = EXCLUDED.text_es;

-- Employment-Based Visas
INSERT INTO law_items (id, law_id, index, number, title, title_es, text, text_es) VALUES
('visa-work-1', 'visa-work', 0, 1, 'H-1B Specialty Occupation', 'H-1B Ocupación Especializada',
 'The H-1B visa is for workers in specialty occupations requiring theoretical or technical expertise. Requirements: (1) bachelor''s degree or equivalent in a specific specialty; (2) employer sponsorship; (3) prevailing wage payment. Annual cap of 65,000 with an additional 20,000 for advanced degree holders. Initial stay of 3 years, extendable to 6 years.',
 'La visa H-1B es para trabajadores en ocupaciones especializadas que requieren experiencia teórica o técnica. Requisitos: (1) licenciatura o equivalente en una especialidad específica; (2) patrocinio del empleador; (3) pago del salario prevaleciente. Tope anual de 65,000 con 20,000 adicionales para poseedores de títulos avanzados. Estadía inicial de 3 años, extensible a 6 años.'),

('visa-work-2', 'visa-work', 1, 2, 'Employment-Based Green Card Categories', 'Categorías de Tarjeta Verde Basada en Empleo',
 'EB-1: Priority Workers (extraordinary ability, outstanding professors, multinational managers). EB-2: Professionals with advanced degrees or exceptional ability. EB-3: Skilled workers, professionals, unskilled workers. EB-4: Special immigrants (religious workers, etc.). EB-5: Immigrant investors (minimum $800,000-$1,050,000 investment). EB-1 and EB-2 may qualify for a National Interest Waiver.',
 'EB-1: Trabajadores prioritarios (habilidad extraordinaria, profesores destacados, gerentes multinacionales). EB-2: Profesionales con títulos avanzados o habilidad excepcional. EB-3: Trabajadores calificados, profesionales, trabajadores no calificados. EB-4: Inmigrantes especiales (trabajadores religiosos, etc.). EB-5: Inversionistas inmigrantes (inversión mínima de $800,000-$1,050,000). EB-1 y EB-2 pueden calificar para un Perdón de Interés Nacional.'),

('visa-work-3', 'visa-work', 2, 3, 'PERM Labor Certification', 'Certificación Laboral PERM',
 'Most EB-2 and EB-3 green card petitions require the employer to obtain a PERM Labor Certification from the Department of Labor, proving there are no qualified US workers available for the position. The employer must conduct recruitment (job postings, advertisements) and offer at least the prevailing wage.',
 'La mayoría de las peticiones de tarjeta verde EB-2 y EB-3 requieren que el empleador obtenga una Certificación Laboral PERM del Departamento de Trabajo, comprobando que no hay trabajadores estadounidenses calificados disponibles para el puesto. El empleador debe realizar reclutamiento (publicaciones de empleo, anuncios) y ofrecer al menos el salario prevaleciente.'),

('visa-work-4', 'visa-work', 3, 4, 'L-1 Intracompany Transfer', 'L-1 Transferencia Intraempresarial',
 'The L-1 visa allows multinational companies to transfer employees to US offices. L-1A: Managers and executives (max 7 years). L-1B: Specialized knowledge workers (max 5 years). Requirement: 1 year of employment with the company abroad within the past 3 years. L-1A holders may qualify for EB-1C green card without PERM labor certification.',
 'La visa L-1 permite a las empresas multinacionales transferir empleados a oficinas de EE.UU. L-1A: Gerentes y ejecutivos (máximo 7 años). L-1B: Trabajadores con conocimiento especializado (máximo 5 años). Requisito: 1 año de empleo con la empresa en el extranjero dentro de los últimos 3 años. Los poseedores de L-1A pueden calificar para tarjeta verde EB-1C sin certificación laboral PERM.'),

('visa-work-5', 'visa-work', 4, 5, 'Employment Authorization Document (EAD)', 'Documento de Autorización de Empleo (EAD)',
 'An EAD (Form I-766) grants temporary work authorization. Categories eligible for EAD include: pending asylum applicants (after 180 days), pending adjustment of status applicants, TPS holders, DACA recipients, spouses of certain visa holders (H-4 EAD for H-1B spouses with approved I-140), and others. File Form I-765 to apply.',
 'Un EAD (Formulario I-766) otorga autorización de trabajo temporal. Las categorías elegibles para EAD incluyen: solicitantes de asilo pendientes (después de 180 días), solicitantes de ajuste de estatus pendientes, poseedores de TPS, beneficiarios de DACA, cónyuges de ciertos titulares de visa (EAD H-4 para cónyuges H-1B con I-140 aprobado) y otros. Presente el Formulario I-765 para solicitar.')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, title_es = EXCLUDED.title_es, text = EXCLUDED.text, text_es = EXCLUDED.text_es;

-- Visa U
INSERT INTO law_items (id, law_id, index, number, title, title_es, text, text_es) VALUES
('visa-u-1', 'visa-u', 0, 1, 'U Visa Eligibility', 'Elegibilidad para Visa U',
 'To be eligible for a U visa, the applicant must: (1) have suffered substantial physical or mental abuse as a result of a qualifying criminal activity; (2) possess information about the criminal activity; (3) have been, is being, or is likely to be helpful to law enforcement in the investigation or prosecution of the crime; and (4) the criminal activity violated U.S. laws.',
 'Para ser elegible para una visa U, el solicitante debe: (1) haber sufrido abuso físico o mental sustancial como resultado de una actividad criminal calificada; (2) poseer información sobre la actividad criminal; (3) haber sido, estar siendo o es probable que sea útil para las fuerzas del orden en la investigación o enjuiciamiento del crimen; y (4) la actividad criminal violó las leyes de EE.UU.'),

('visa-u-2', 'visa-u', 1, 2, 'Qualifying Crimes', 'Crímenes Calificados',
 'Qualifying crimes include: abduction, abusive sexual contact, blackmail, domestic violence, extortion, false imprisonment, felonious assault, female genital mutilation, fraud in foreign labor contracting, hostage taking, incest, involuntary servitude, kidnapping, manslaughter, murder, obstruction of justice, peonage, perjury, prostitution, rape, sexual assault, sexual exploitation, slave trade, stalking, torture, trafficking, witness tampering, unlawful criminal restraint, and attempts or conspiracies to commit any of these.',
 'Los crímenes calificados incluyen: secuestro, contacto sexual abusivo, chantaje, violencia doméstica, extorsión, encarcelamiento falso, agresión grave, mutilación genital femenina, fraude en contratación laboral extranjera, toma de rehenes, incesto, servidumbre involuntaria, rapto, homicidio involuntario, asesinato, obstrucción de justicia, trabajo forzado, perjurio, prostitución, violación, agresión sexual, explotación sexual, trata de esclavos, acoso, tortura, tráfico, manipulación de testigos, restricción criminal ilegal, e intentos o conspiraciones para cometer cualquiera de estos.'),

('visa-u-3', 'visa-u', 2, 3, 'U Visa Benefits', 'Beneficios de la Visa U',
 'U visa holders receive: (1) nonimmigrant status for up to 4 years; (2) employment authorization; (3) ability to apply for qualifying family members (spouse, children, parents if applicant is under 21, siblings if under 18). After 3 years in U status, the holder may apply for adjustment to permanent resident status (green card). Annual cap of 10,000 U visas.',
 'Los titulares de visa U reciben: (1) estatus de no inmigrante por hasta 4 años; (2) autorización de empleo; (3) capacidad de solicitar para familiares calificados (cónyuge, hijos, padres si el solicitante es menor de 21 años, hermanos si es menor de 18). Después de 3 años en estatus U, el titular puede solicitar ajuste a estatus de residente permanente (tarjeta verde). Tope anual de 10,000 visas U.'),

('visa-u-4', 'visa-u', 3, 4, 'Law Enforcement Certification', 'Certificación de las Fuerzas del Orden',
 'The applicant must obtain a law enforcement certification (Form I-918 Supplement B) from a certifying agency confirming cooperation. Certifying agencies include: police, prosecutors, judges, EEOC, Department of Labor, child/adult protective services, and other federal/state agencies that detect or investigate criminal activity.',
 'El solicitante debe obtener una certificación de las fuerzas del orden (Formulario I-918 Suplemento B) de una agencia certificadora confirmando la cooperación. Las agencias certificadoras incluyen: policía, fiscales, jueces, EEOC, Departamento de Trabajo, servicios de protección de menores/adultos, y otras agencias federales/estatales que detectan o investigan actividad criminal.')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, title_es = EXCLUDED.title_es, text = EXCLUDED.text, text_es = EXCLUDED.text_es;

-- Visa T
INSERT INTO law_items (id, law_id, index, number, title, title_es, text, text_es) VALUES
('visa-t-1', 'visa-t', 0, 1, 'T Visa Eligibility', 'Elegibilidad para Visa T',
 'A T visa is available to victims of severe forms of trafficking in persons. The applicant must: (1) be or have been a victim of a severe form of trafficking; (2) be physically present in the US on account of the trafficking; (3) comply with reasonable requests for assistance in the investigation or prosecution (or be under 18); and (4) demonstrate that they would suffer extreme hardship involving unusual and severe harm if removed from the US.',
 'Una visa T está disponible para víctimas de formas severas de tráfico de personas. El solicitante debe: (1) ser o haber sido víctima de una forma severa de tráfico; (2) estar físicamente presente en EE.UU. a causa del tráfico; (3) cumplir con solicitudes razonables de asistencia en la investigación o enjuiciamiento (o ser menor de 18 años); y (4) demostrar que sufriría dificultades extremas que implican daño inusual y severo si es removido de EE.UU.'),

('visa-t-2', 'visa-t', 1, 2, 'T Visa Benefits', 'Beneficios de la Visa T',
 'T visa holders receive: (1) nonimmigrant status for up to 4 years; (2) employment authorization; (3) access to federal and state benefits (like refugees); (4) ability to apply for qualifying family members. After 3 years (or upon completion of the investigation/prosecution), the holder may apply for adjustment to permanent resident status. Annual cap of 5,000 T visas.',
 'Los titulares de visa T reciben: (1) estatus de no inmigrante por hasta 4 años; (2) autorización de empleo; (3) acceso a beneficios federales y estatales (como refugiados); (4) capacidad de solicitar para familiares calificados. Después de 3 años (o al completar la investigación/enjuiciamiento), el titular puede solicitar ajuste a estatus de residente permanente. Tope anual de 5,000 visas T.'),

('visa-t-3', 'visa-t', 2, 3, 'Severe Forms of Trafficking', 'Formas Severas de Tráfico',
 'Severe forms of trafficking include: (1) Sex trafficking: when a person is induced to perform a commercial sex act through force, fraud, or coercion, or is under 18; (2) Labor trafficking: recruitment, harboring, transportation, provision, or obtaining of a person for labor or services through force, fraud, or coercion for the purpose of subjection to involuntary servitude, peonage, debt bondage, or slavery.',
 'Las formas severas de tráfico incluyen: (1) Tráfico sexual: cuando una persona es inducida a realizar un acto sexual comercial mediante fuerza, fraude o coerción, o es menor de 18 años; (2) Tráfico laboral: reclutamiento, albergue, transporte, provisión u obtención de una persona para trabajo o servicios mediante fuerza, fraude o coerción con el propósito de sujeción a servidumbre involuntaria, trabajo forzado, servidumbre por deuda o esclavitud.'),

('visa-t-4', 'visa-t', 3, 4, 'Continued Presence', 'Presencia Continuada',
 'Federal law enforcement may request Continued Presence (CP) for trafficking victims who are potential witnesses. CP is a temporary immigration status that allows victims to remain in the US during the investigation. Victims with CP receive employment authorization and may be eligible for certain benefits. CP is not a visa and must be renewed every 2 years.',
 'Las fuerzas del orden federales pueden solicitar Presencia Continuada (CP) para víctimas de tráfico que son testigos potenciales. La CP es un estatus migratorio temporal que permite a las víctimas permanecer en EE.UU. durante la investigación. Las víctimas con CP reciben autorización de empleo y pueden ser elegibles para ciertos beneficios. La CP no es una visa y debe renovarse cada 2 años.')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, title_es = EXCLUDED.title_es, text = EXCLUDED.text, text_es = EXCLUDED.text_es;


-- ============================================================
-- CONSTITUTIONAL RIGHTS FOR IMMIGRANTS
-- ============================================================

INSERT INTO laws (id, title, title_es, category, type, article_count, searchable_text, searchable_text_es)
VALUES
('const-rights', 'Constitutional Rights for Immigrants', 'Derechos Constitucionales para Inmigrantes', 'asylum', 'U.S. Constitution', 5,
 'constitutional rights due process equal protection fourth amendment fifth amendment',
 'derechos constitucionales debido proceso protección igual cuarta enmienda quinta enmienda')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, title_es = EXCLUDED.title_es, article_count = EXCLUDED.article_count;

INSERT INTO law_items (id, law_id, index, number, title, title_es, text, text_es) VALUES
('const-1', 'const-rights', 0, 1, 'Fifth Amendment - Due Process', 'Quinta Enmienda - Debido Proceso',
 'The Fifth Amendment guarantees that no person shall be deprived of life, liberty, or property without due process of law. This protection applies to ALL persons in the United States, regardless of immigration status. In immigration proceedings, this means the right to a fair hearing before an immigration judge.',
 'La Quinta Enmienda garantiza que ninguna persona será privada de su vida, libertad o propiedad sin el debido proceso legal. Esta protección se aplica a TODAS las personas en los Estados Unidos, independientemente de su estatus migratorio. En procedimientos de inmigración, esto significa el derecho a una audiencia justa ante un juez de inmigración.'),

('const-2', 'const-rights', 1, 2, 'Fourth Amendment - Search and Seizure', 'Cuarta Enmienda - Registro e Incautación',
 'The Fourth Amendment protects ALL persons from unreasonable searches and seizures by the government. ICE and other immigration agents generally need a warrant signed by a judge to enter a private home. At the border (within 100 miles), agents have expanded authority, but still cannot perform unreasonable searches.',
 'La Cuarta Enmienda protege a TODAS las personas de registros e incautaciones irrazonables por parte del gobierno. ICE y otros agentes de inmigración generalmente necesitan una orden firmada por un juez para entrar a una casa privada. En la frontera (dentro de 100 millas), los agentes tienen autoridad ampliada, pero aún no pueden realizar registros irrazonables.'),

('const-3', 'const-rights', 2, 3, 'Right to Remain Silent', 'Derecho a Guardar Silencio',
 'Under the Fifth Amendment, you have the right to remain silent and cannot be compelled to incriminate yourself. If stopped by immigration agents: (1) you have the right to remain silent; (2) you do not have to answer questions about your immigration status; (3) you can say "I wish to remain silent" and "I want to speak to a lawyer."',
 'Bajo la Quinta Enmienda, usted tiene el derecho a guardar silencio y no puede ser obligado a auto incriminarse. Si es detenido por agentes de inmigración: (1) tiene el derecho a guardar silencio; (2) no tiene que responder preguntas sobre su estatus migratorio; (3) puede decir "Deseo guardar silencio" y "Quiero hablar con un abogado."'),

('const-4', 'const-rights', 3, 4, 'Fourteenth Amendment - Equal Protection', 'Decimocuarta Enmienda - Protección Igualitaria',
 'The Fourteenth Amendment ensures that no state shall deny any person within its jurisdiction the equal protection of the laws. The Supreme Court has ruled that children of undocumented immigrants have the right to free public education (Plyler v. Doe, 1982). Emergency medical care must also be provided regardless of immigration status (EMTALA).',
 'La Decimocuarta Enmienda asegura que ningún estado negará a ninguna persona dentro de su jurisdicción la protección igualitaria de las leyes. La Corte Suprema ha dictaminado que los hijos de inmigrantes indocumentados tienen derecho a educación pública gratuita (Plyler v. Doe, 1982). La atención médica de emergencia también debe ser proporcionada independientemente del estatus migratorio (EMTALA).'),

('const-5', 'const-rights', 4, 5, 'Know Your Rights During an ICE Encounter', 'Conozca Sus Derechos Durante un Encuentro con ICE',
 'During an encounter with ICE agents: (1) You do not have to open the door unless they have a judicial warrant (signed by a judge, not just an ICE administrative warrant); (2) You have the right to remain silent; (3) You have the right to an attorney; (4) Do not sign anything you don''t understand; (5) Do not provide false documents; (6) Remember the badge numbers and names of agents; (7) If arrested, ask for a bond hearing before an immigration judge.',
 'Durante un encuentro con agentes de ICE: (1) No tiene que abrir la puerta a menos que tengan una orden judicial (firmada por un juez, no solo una orden administrativa de ICE); (2) Tiene derecho a guardar silencio; (3) Tiene derecho a un abogado; (4) No firme nada que no entienda; (5) No proporcione documentos falsos; (6) Recuerde los números de placa y nombres de los agentes; (7) Si es arrestado, pida una audiencia de fianza ante un juez de inmigración.')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, title_es = EXCLUDED.title_es, text = EXCLUDED.text, text_es = EXCLUDED.text_es;


-- ============================================================
-- Update system_metadata timestamp
-- ============================================================

UPDATE system_metadata
SET laws_last_updated = NOW(), last_upload_count = 53
WHERE id = 'main';
