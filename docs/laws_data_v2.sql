-- ============================================================
-- laws_data_v2.sql — MigraGuide USA (Part 1)
-- Additional US Immigration Laws (Bilingual EN/ES)
-- Run in Supabase SQL Editor AFTER laws_data.sql
-- ============================================================

-- ============================================================
-- INA §212 — GROUNDS OF INADMISSIBILITY
-- ============================================================

INSERT INTO laws (id, title, title_es, category, type, article_count, searchable_text, searchable_text_es)
VALUES
('ina-212', 'INA §212 - Grounds of Inadmissibility', 'INA §212 - Causas de Inadmisibilidad', 'deportation', 'Federal Statute', 6,
 'inadmissibility grounds health criminal public charge immigration fraud unlawful presence',
 'inadmisibilidad causas salud criminal carga pública fraude migratoria presencia ilegal')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, title_es = EXCLUDED.title_es, article_count = EXCLUDED.article_count;

INSERT INTO law_items (id, law_id, index, number, title, title_es, text, text_es) VALUES
('ina-212-1', 'ina-212', 0, 1, 'Health-Related Grounds', 'Causas Relacionadas con la Salud',
 'An alien is inadmissible if found to have a communicable disease of public health significance, failure to show proof of required vaccinations, a physical or mental disorder with associated harmful behavior, or drug abuse/addiction. Required vaccinations include: mumps, measles, rubella, polio, tetanus, hepatitis A and B, influenza, and COVID-19 (varies).',
 'Un extranjero es inadmisible si se determina que tiene una enfermedad transmisible de importancia para la salud pública, falta de prueba de vacunaciones requeridas, un trastorno físico o mental con comportamiento dañino asociado, o abuso/adicción a drogas. Las vacunaciones requeridas incluyen: paperas, sarampión, rubéola, polio, tétanos, hepatitis A y B, influenza y COVID-19 (varía).'),
('ina-212-2', 'ina-212', 1, 2, 'Criminal Grounds', 'Causas Penales',
 'An alien is inadmissible if convicted of or admits to: (1) a crime involving moral turpitude (CIMT) — theft, fraud, assault with intent; (2) a controlled substance violation; (3) multiple criminal convictions with aggregate sentences of 5+ years; (4) drug trafficking; (5) prostitution; (6) human trafficking. Petty offense exception: one CIMT with maximum penalty under 1 year and sentence under 6 months.',
 'Un extranjero es inadmisible si ha sido condenado o admite: (1) un crimen que involucra bajeza moral (CIMT) — robo, fraude, agresión con intención; (2) una violación de sustancias controladas; (3) múltiples condenas penales con sentencias agregadas de 5+ años; (4) narcotráfico; (5) prostitución; (6) tráfico de personas. Excepción de delito menor: un CIMT con pena máxima menor a 1 año y sentencia menor a 6 meses.'),
('ina-212-3', 'ina-212', 2, 3, 'Public Charge Ground', 'Causa de Carga Pública',
 'An alien likely to become a "public charge" is inadmissible. Factors considered: age, health, family status, assets, resources, financial status, education, and skills. Government benefits that count: SSI, TANF, state/local cash assistance, long-term institutionalized Medicaid. Benefits that do NOT count: emergency Medicaid, disaster relief, school lunches, CHIP, WIC, housing assistance.',
 'Un extranjero que probablemente se convierta en "carga pública" es inadmisible. Factores considerados: edad, salud, estado familiar, activos, recursos, situación financiera, educación y habilidades. Beneficios gubernamentales que cuentan: SSI, TANF, asistencia en efectivo estatal/local, Medicaid institucionalizado a largo plazo. Beneficios que NO cuentan: Medicaid de emergencia, ayuda por desastres, almuerzos escolares, CHIP, WIC, asistencia de vivienda.'),
('ina-212-4', 'ina-212', 3, 4, 'Immigration Fraud and Misrepresentation', 'Fraude Migratorio y Tergiversación',
 'Any alien who seeks to procure or has procured a visa, admission, or other immigration benefit by fraud or willful misrepresentation of a material fact is inadmissible. This is a permanent bar unless a waiver (I-601) is approved. The misrepresentation must be material — meaning it would have influenced the immigration decision.',
 'Cualquier extranjero que busque obtener o haya obtenido una visa, admisión u otro beneficio migratorio mediante fraude o tergiversación deliberada de un hecho material es inadmisible. Esta es una prohibición permanente a menos que se apruebe un perdón (I-601). La tergiversación debe ser material — significando que habría influido en la decisión migratoria.'),
('ina-212-5', 'ina-212', 4, 5, 'Unlawful Presence Bars', 'Prohibiciones por Presencia Ilegal',
 'INA §212(a)(9)(B): An alien unlawfully present for more than 180 days but less than 1 year who voluntarily departs is inadmissible for 3 years. An alien unlawfully present for 1 year or more is inadmissible for 10 years. INA §212(a)(9)(C): An alien who has been unlawfully present for 1+ year AND who reenters without inspection is permanently inadmissible (may apply for consent to reapply after 10 years).',
 'INA §212(a)(9)(B): Un extranjero con presencia ilegal por más de 180 días pero menos de 1 año que sale voluntariamente es inadmisible por 3 años. Un extranjero con presencia ilegal por 1 año o más es inadmisible por 10 años. INA §212(a)(9)(C): Un extranjero con presencia ilegal de 1+ año Y que reingresa sin inspección es permanentemente inadmisible (puede solicitar consentimiento para reaplicar después de 10 años).'),
('ina-212-6', 'ina-212', 5, 6, 'Waivers of Inadmissibility', 'Perdones de Inadmisibilidad',
 'Several waivers are available: I-601 Waiver: for fraud, criminal grounds, unlawful presence (requires US citizen or LPR qualifying relative and extreme hardship). I-601A Provisional Waiver: for unlawful presence only, filed before departing for consular processing (requires US citizen spouse or parent). I-212: consent to reapply after deportation. Each waiver has specific eligibility requirements.',
 'Varios perdones están disponibles: Perdón I-601: para fraude, causas penales, presencia ilegal (requiere familiar calificado ciudadano o LPR y dificultad extrema). Perdón Provisional I-601A: solo para presencia ilegal, presentado antes de partir al procesamiento consular (requiere cónyuge o padre ciudadano). I-212: consentimiento para reaplicar después de deportación. Cada perdón tiene requisitos de elegibilidad específicos.')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, title_es = EXCLUDED.title_es, text = EXCLUDED.text, text_es = EXCLUDED.text_es;

-- ============================================================
-- INA §245 — ADJUSTMENT OF STATUS
-- ============================================================

INSERT INTO laws (id, title, title_es, category, type, article_count, searchable_text, searchable_text_es)
VALUES
('ina-245', 'INA §245 - Adjustment of Status', 'INA §245 - Ajuste de Estatus', 'visas', 'Federal Statute', 5,
 'adjustment status green card permanent resident I-485 eligibility interview',
 'ajuste estatus tarjeta verde residente permanente I-485 elegibilidad entrevista')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, title_es = EXCLUDED.title_es, article_count = EXCLUDED.article_count;

INSERT INTO law_items (id, law_id, index, number, title, title_es, text, text_es) VALUES
('ina-245-1', 'ina-245', 0, 1, 'General Eligibility', 'Elegibilidad General',
 'An alien may apply for adjustment of status to permanent resident if: (1) an immigrant visa is immediately available; (2) the alien was inspected and admitted or paroled into the US; (3) the alien is eligible for an immigrant visa; (4) the alien is admissible to the US (or obtains a waiver). File Form I-485 with USCIS along with supporting documents.',
 'Un extranjero puede solicitar ajuste de estatus a residente permanente si: (1) una visa de inmigrante está inmediatamente disponible; (2) el extranjero fue inspeccionado y admitido o en parole a EE.UU.; (3) el extranjero es elegible para una visa de inmigrante; (4) el extranjero es admisible a EE.UU. (u obtiene un perdón). Presente el Formulario I-485 con USCIS junto con documentación de respaldo.'),
('ina-245-2', 'ina-245', 1, 2, 'INA §245(i) — Special Provision', 'INA §245(i) — Provisión Especial',
 'Section 245(i) allows certain aliens who entered without inspection or who are otherwise ineligible for adjustment to adjust status by paying a $1,000 penalty. Requires that an immigrant petition or labor certification was filed on or before April 30, 2001, and the alien was physically present on December 21, 2000. This is a critical provision for many undocumented immigrants.',
 'La Sección 245(i) permite que ciertos extranjeros que entraron sin inspección o que de otro modo son inelegibles para ajuste puedan ajustar su estatus pagando una penalidad de $1,000. Requiere que una petición de inmigrante o certificación laboral haya sido presentada en o antes del 30 de abril de 2001, y que el extranjero estuviera físicamente presente el 21 de diciembre de 2000. Esta es una provisión crítica para muchos inmigrantes indocumentados.'),
('ina-245-3', 'ina-245', 2, 3, 'Concurrent Filing', 'Presentación Concurrente',
 'When a visa number is immediately available, an applicant may file Form I-485 concurrently with Form I-130 (family) or I-140 (employment). Benefits of concurrent filing: (1) employment authorization (EAD) while pending; (2) advance parole (travel document); (3) ability to change employers (for EB cases after 180 days, portability under AC21).',
 'Cuando un número de visa está inmediatamente disponible, un solicitante puede presentar el Formulario I-485 concurrentemente con el Formulario I-130 (familia) o I-140 (empleo). Beneficios de la presentación concurrente: (1) autorización de empleo (EAD) mientras está pendiente; (2) advance parole (documento de viaje); (3) capacidad de cambiar empleadores (para casos EB después de 180 días, portabilidad bajo AC21).'),
('ina-245-4', 'ina-245', 3, 4, 'The Adjustment Interview', 'La Entrevista de Ajuste',
 'USCIS may schedule an interview for adjustment applicants. At the interview: (1) bring all original documents (passport, birth certificate, marriage certificate, I-94, etc.); (2) bring the interview notice; (3) be prepared to answer questions about your application and background; (4) spouse/family cases: both petitioner and beneficiary must attend. Some employment-based cases may have the interview waived.',
 'USCIS puede programar una entrevista para solicitantes de ajuste. En la entrevista: (1) traiga todos los documentos originales (pasaporte, acta de nacimiento, certificado de matrimonio, I-94, etc.); (2) traiga la notificación de entrevista; (3) esté preparado para responder preguntas sobre su solicitud y antecedentes; (4) casos de cónyuge/familia: tanto el peticionario como el beneficiario deben asistir. Algunos casos basados en empleo pueden tener la entrevista exonerada.'),
('ina-245-5', 'ina-245', 4, 5, 'Bars to Adjustment', 'Impedimentos al Ajuste',
 'You may NOT adjust status if: (1) you entered without inspection (unless 245(i) eligible or immediate relative of USC); (2) you violated status or worked without authorization (exceptions for immediate relatives of USCs); (3) you were not in valid status on the date of filing; (4) you are in removal proceedings (unless eligible for concurrent adjustment); (5) you previously failed to attend removal proceedings.',
 'NO puede ajustar estatus si: (1) entró sin inspección (a menos que sea elegible bajo 245(i) o familiar inmediato de ciudadano); (2) violó su estatus o trabajó sin autorización (excepciones para familiares inmediatos de ciudadanos); (3) no estaba en estatus válido en la fecha de presentación; (4) está en procedimientos de remoción (a menos que sea elegible para ajuste concurrente); (5) previamente no asistió a procedimientos de remoción.')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, title_es = EXCLUDED.title_es, text = EXCLUDED.text, text_es = EXCLUDED.text_es;

-- ============================================================
-- VAWA — VIOLENCE AGAINST WOMEN ACT
-- ============================================================

INSERT INTO laws (id, title, title_es, category, type, article_count, searchable_text, searchable_text_es)
VALUES
('vawa', 'VAWA - Violence Against Women Act', 'VAWA - Ley de Violencia Contra la Mujer', 'asylum', 'Federal Statute', 5,
 'VAWA violence against women domestic abuse self-petition protection battered spouse',
 'VAWA violencia contra mujer abuso doméstico autopetición protección cónyuge maltratado')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, title_es = EXCLUDED.title_es, article_count = EXCLUDED.article_count;

INSERT INTO law_items (id, law_id, index, number, title, title_es, text, text_es) VALUES
('vawa-1', 'vawa', 0, 1, 'VAWA Self-Petition', 'Autopetición VAWA',
 'VAWA allows abused spouses, children, and parents of US citizens or permanent residents to file an immigrant petition (I-360) without the abuser''s knowledge or consent. The applicant does not need the abuser to sponsor them. This is one of the most important protections for victims of domestic violence in immigration law.',
 'VAWA permite que cónyuges, hijos y padres maltratados de ciudadanos o residentes permanentes presenten una petición de inmigrante (I-360) sin el conocimiento o consentimiento del abusador. El solicitante no necesita que el abusador lo patrocine. Esta es una de las protecciones más importantes para víctimas de violencia doméstica en la ley de inmigración.'),
('vawa-2', 'vawa', 1, 2, 'Eligibility Requirements', 'Requisitos de Elegibilidad',
 'To qualify for VAWA self-petition: (1) qualifying relationship (spouse, child, or parent of USC/LPR); (2) resided with the abuser; (3) subjected to battery or extreme cruelty (physical abuse, emotional abuse, isolation, threats, economic control); (4) good moral character; (5) married in good faith (for spouse petitions). Divorce within 2 years before filing is permitted if related to the abuse.',
 'Para calificar para la autopetición VAWA: (1) relación calificada (cónyuge, hijo o padre de ciudadano/LPR); (2) residió con el abusador; (3) fue sometido a maltrato o crueldad extrema (abuso físico, abuso emocional, aislamiento, amenazas, control económico); (4) buen carácter moral; (5) matrimonio de buena fe (para peticiones de cónyuge). El divorcio dentro de los 2 años antes de presentar está permitido si está relacionado con el abuso.'),
('vawa-3', 'vawa', 2, 3, 'Evidence for VAWA Cases', 'Evidencia para Casos VAWA',
 'Evidence can include: police reports, protection orders, medical records, photographs of injuries, affidavits from witnesses (friends, family, counselors), records from shelters, school records showing behavioral changes in children, therapy notes, and a detailed personal declaration. No single piece of evidence is required — USCIS considers the totality of the evidence.',
 'La evidencia puede incluir: informes policiales, órdenes de protección, registros médicos, fotografías de lesiones, declaraciones juradas de testigos (amigos, familia, consejeros), registros de refugios, registros escolares que muestren cambios de comportamiento en niños, notas de terapia y una declaración personal detallada. No se requiere una sola pieza de evidencia — USCIS considera la totalidad de la evidencia.'),
('vawa-4', 'vawa', 3, 4, 'Benefits and Protections', 'Beneficios y Protecciones',
 'Approved VAWA self-petitioners receive: (1) deferred action (protection from deportation) while the case is pending; (2) employment authorization; (3) eligibility for certain public benefits; (4) ability to adjust status to permanent resident when a visa is available; (5) confidentiality — DHS cannot contact the abuser or disclose information about the case.',
 'Los autopeticionarios VAWA aprobados reciben: (1) acción diferida (protección contra deportación) mientras el caso está pendiente; (2) autorización de empleo; (3) elegibilidad para ciertos beneficios públicos; (4) capacidad de ajustar estatus a residente permanente cuando una visa esté disponible; (5) confidencialidad — DHS no puede contactar al abusador ni divulgar información sobre el caso.'),
('vawa-5', 'vawa', 4, 5, 'VAWA Cancellation of Removal', 'Cancelación de Remoción VAWA',
 'A special form of cancellation of removal exists for VAWA-eligible individuals in removal proceedings. Requirements: (1) battered spouse/child/parent of USC or LPR; (2) 3 years continuous physical presence (not 10 years like regular cancellation); (3) good moral character; (4) extreme hardship to the applicant or the applicant''s child. The 3-year presence requirement is significantly less than the standard 10-year requirement.',
 'Existe una forma especial de cancelación de remoción para individuos elegibles bajo VAWA en procedimientos de remoción. Requisitos: (1) cónyuge/hijo/padre maltratado de ciudadano o LPR; (2) 3 años de presencia física continua (no 10 años como la cancelación regular); (3) buen carácter moral; (4) dificultad extrema para el solicitante o el hijo del solicitante. El requisito de presencia de 3 años es significativamente menor que el requisito estándar de 10 años.')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, title_es = EXCLUDED.title_es, text = EXCLUDED.text, text_es = EXCLUDED.text_es;

-- ============================================================
-- INA §237 — DEPORTABILITY GROUNDS
-- ============================================================

INSERT INTO laws (id, title, title_es, category, type, article_count, searchable_text, searchable_text_es)
VALUES
('ina-237', 'INA §237 - Grounds of Deportability', 'INA §237 - Causas de Deportabilidad', 'deportation', 'Federal Statute', 5,
 'deportability grounds removable criminal aggravated felony status violator overstay',
 'deportabilidad causas removible criminal delito agravado violador estatus sobreestadía')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, title_es = EXCLUDED.title_es, article_count = EXCLUDED.article_count;

INSERT INTO law_items (id, law_id, index, number, title, title_es, text, text_es) VALUES
('ina-237-1', 'ina-237', 0, 1, 'Deportable for Immigration Violations', 'Deportable por Violaciones Migratorias',
 'An alien is deportable if: (1) inadmissible at time of entry or adjustment; (2) present in violation of law (overstay, unauthorized entry); (3) violated the conditions of status (working without authorization, failing to maintain student status); (4) terminated conditional permanent resident status (failed to remove conditions on 2-year green card). Visa overstays are the most common ground.',
 'Un extranjero es deportable si: (1) era inadmisible al momento de entrada o ajuste; (2) presente en violación de la ley (sobreestadía, entrada no autorizada); (3) violó las condiciones de su estatus (trabajar sin autorización, no mantener estatus de estudiante); (4) se terminó el estatus de residente permanente condicional (no removió condiciones de tarjeta verde de 2 años). Las sobreestadías de visa son la causa más común.'),
('ina-237-2', 'ina-237', 1, 2, 'Aggravated Felony', 'Delito Agravado',
 'An aggravated felony makes an alien deportable and bars almost all forms of relief. The INA defines 21 categories including: murder, rape, sexual abuse of a minor, drug trafficking, firearms trafficking, money laundering, fraud/tax evasion over $10,000, theft/burglary with 1+ year sentence, crimes of violence with 1+ year sentence, and child pornography. Even misdemeanors can be classified as aggravated felonies if the sentence is 1+ year.',
 'Un delito agravado hace a un extranjero deportable y prohíbe casi todas las formas de alivio. La INA define 21 categorías incluyendo: asesinato, violación, abuso sexual de menor, narcotráfico, tráfico de armas, lavado de dinero, fraude/evasión fiscal superior a $10,000, robo con sentencia de 1+ año, crímenes de violencia con sentencia de 1+ año, y pornografía infantil. Incluso delitos menores pueden clasificarse como delitos agravados si la sentencia es de 1+ año.'),
('ina-237-3', 'ina-237', 2, 3, 'Criminal Grounds', 'Causas Penales',
 'An alien is deportable for: (1) crimes involving moral turpitude committed within 5 years of admission with potential sentence of 1+ year; (2) two or more CIMTs at any time after admission; (3) controlled substance offenses (except simple possession of 30g or less of marijuana); (4) firearms offenses; (5) domestic violence, stalking, child abuse, or violation of protection order; (6) failure to register as a sex offender.',
 'Un extranjero es deportable por: (1) crímenes de bajeza moral cometidos dentro de 5 años de admisión con sentencia potencial de 1+ año; (2) dos o más CIMTs en cualquier momento después de admisión; (3) delitos de sustancias controladas (excepto posesión simple de 30g o menos de marihuana); (4) delitos de armas de fuego; (5) violencia doméstica, acoso, abuso infantil o violación de orden de protección; (6) falta de registro como delincuente sexual.'),
('ina-237-4', 'ina-237', 3, 4, 'Relief from Deportation', 'Alivio de la Deportación',
 'Available relief includes: (1) Cancellation of Removal (10 years presence, good moral character, exceptional hardship); (2) Asylum/Withholding of Removal (fear of persecution); (3) Convention Against Torture (CAT) protection; (4) Voluntary Departure; (5) Adjustment of Status (if eligible); (6) Private bill (rare, through Congress); (7) Prosecutorial discretion. Aggravated felons are barred from most relief.',
 'El alivio disponible incluye: (1) Cancelación de Remoción (10 años de presencia, buen carácter moral, dificultad excepcional); (2) Asilo/Retención de Remoción (temor a persecución); (3) Protección bajo Convención contra la Tortura (CAT); (4) Salida Voluntaria; (5) Ajuste de Estatus (si es elegible); (6) Proyecto de ley privado (raro, a través del Congreso); (7) Discreción fiscal. Los condenados por delitos agravados están prohibidos de la mayoría del alivio.'),
('ina-237-5', 'ina-237', 4, 5, 'Withholding of Removal & CAT', 'Retención de Remoción y CAT',
 'Withholding of Removal (INA §241(b)(3)): higher standard than asylum — must show "more likely than not" to face persecution. Not a bar for aggravated felony if sentence under 5 years. Convention Against Torture (CAT): protects anyone who would "more likely than not" be tortured by or with the acquiescence of a government official. CAT has no criminal bars — even aggravated felons qualify. Neither provides a path to permanent residence.',
 'Retención de Remoción (INA §241(b)(3)): estándar más alto que asilo — debe demostrar "más probable que no" enfrentar persecución. No es impedimento por delito agravado si la sentencia es menor a 5 años. Convención contra la Tortura (CAT): protege a cualquiera que "más probable que no" sería torturado por o con la aquiescencia de un funcionario del gobierno. CAT no tiene impedimentos penales — incluso condenados por delitos agravados califican. Ninguno proporciona un camino a la residencia permanente.')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, title_es = EXCLUDED.title_es, text = EXCLUDED.text, text_es = EXCLUDED.text_es;
