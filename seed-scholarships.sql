-- Seed Data for Scholarships
-- This file contains initial scholarship data to populate the database
-- Run this in your Supabase SQL Editor after creating the tables

INSERT INTO scholarships (id, title, description, eligibility_criteria, deadline, country, language, link, created_at)
VALUES
  (
    gen_random_uuid(),
    'Chevening Scholarships',
    'UK government''s global scholarship programme, funded by the Foreign, Commonwealth and Development Office (FCDO) and partner organisations.',
    'Bachelor''s degree, 2 years work experience, English proficiency, leadership potential',
    '2026-11-02',
    'UK',
    'English',
    'https://www.chevening.org/',
    NOW()
  ),
  (
    gen_random_uuid(),
    'Fulbright Foreign Student Program',
    'Enables graduate students, young professionals and artists from abroad to study and conduct research in the United States.',
    'Bachelor''s degree, Academic excellence, Leadership potential, English proficiency',
    '2026-10-15',
    'USA',
    'English',
    'https://foreign.fulbrightonline.org/',
    NOW()
  ),
  (
    gen_random_uuid(),
    'DAAD Scholarships',
    'German Academic Exchange Service offers scholarships for international students to study in Germany.',
    'Bachelor''s degree, Good academic record, German or English proficiency',
    '2026-11-30',
    'Germany',
    'English/German',
    'https://www.daad.de/en/',
    NOW()
  ),
  (
    gen_random_uuid(),
    'Australia Awards Scholarships',
    'Long-term development awards administered by the Australian Government to enable people from developing countries to study in Australia.',
    'Bachelor''s degree, Work experience, English proficiency, Citizen of eligible country',
    '2026-12-15',
    'Australia',
    'English',
    'https://www.australiaawards.gov.au/',
    NOW()
  ),
  (
    gen_random_uuid(),
    'Erasmus Mundus Joint Masters',
    'High-level integrated international study programmes delivered by consortia of European and non-European higher education institutions.',
    'Bachelor''s degree, Academic excellence, English proficiency',
    '2026-01-15',
    'Europe',
    'English',
    'https://erasmus-plus.ec.europa.eu/',
    NOW()
  ),
  (
    gen_random_uuid(),
    'Commonwealth Scholarships',
    'Aimed at students from low and middle-income Commonwealth countries to pursue Master''s and PhD study in the UK.',
    'Bachelor''s degree, Citizen of Commonwealth country, Financial need, Academic merit',
    '2026-12-01',
    'UK',
    'English',
    'https://cscuk.fcdo.gov.uk/',
    NOW()
  ),
  (
    gen_random_uuid(),
    'Gates Cambridge Scholarships',
    'Full-cost scholarships for outstanding applicants from countries outside the UK to pursue a postgraduate degree at Cambridge.',
    'Bachelor''s degree, Outstanding academic achievement, Leadership potential, Commitment to improving lives',
    '2026-12-05',
    'UK',
    'English',
    'https://www.gatescambridge.org/',
    NOW()
  ),
  (
    gen_random_uuid(),
    'Rhodes Scholarships',
    'The oldest and most celebrated international fellowship awards in the world for study at the University of Oxford.',
    'Bachelor''s degree, Exceptional academic achievement, Leadership, Character, Commitment to service',
    '2026-10-01',
    'UK',
    'English',
    'https://www.rhodeshouse.ox.ac.uk/',
    NOW()
  ),
  (
    gen_random_uuid(),
    'Swedish Institute Scholarships',
    'For highly qualified international students from select countries to pursue Master''s studies in Sweden.',
    'Bachelor''s degree, Academic excellence, Leadership experience, English proficiency',
    '2026-02-20',
    'Sweden',
    'English',
    'https://si.se/en/apply/scholarships/',
    NOW()
  ),
  (
    gen_random_uuid(),
    'MEXT Scholarships (Japan)',
    'Japanese Government scholarships for international students to study at Japanese universities.',
    'Bachelor''s degree, Good academic record, Japanese or English proficiency, Under 35 years',
    '2026-05-31',
    'Japan',
    'English/Japanese',
    'https://www.mext.go.jp/en/',
    NOW()
  );

-- Verify the data was inserted
SELECT COUNT(*) as total_scholarships FROM scholarships;
