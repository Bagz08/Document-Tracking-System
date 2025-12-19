-- Seed script to add sample documents to the database
-- Run this SQL script in your database client to populate sample data

-- First, ensure AI columns exist (run this if columns don't exist)
ALTER TABLE office_docs
ADD COLUMN ai_category VARCHAR(100) DEFAULT NULL,
ADD COLUMN ai_confidence DECIMAL(5,2) DEFAULT NULL;

-- Insert sample documents
-- Note: These will need AI categorization to be run via the API or recategorize endpoint
-- The AI categories shown are what the AI should categorize them as

INSERT INTO office_docs (dts_number, title, description, doc_type, registered_by, status, date_registered) VALUES
('20250000002', 'Academic Calendar 2025-2026', 'Proposed academic calendar for the upcoming academic year including semester dates, holidays, and examination periods', 'Academics', 1, 'ended', NOW()),
('20250000003', 'Research Grant Application - Community Health Study', 'Application for research funding to conduct a comprehensive community health assessment and intervention program', 'Research and Extension', 1, 'received', DATE_SUB(NOW(), INTERVAL 1 DAY)),
('20250000004', 'Student Scholarship Program Guidelines', 'Updated guidelines and requirements for student scholarship applications and financial aid programs', 'Student Services', 1, 'ended', DATE_SUB(NOW(), INTERVAL 2 DAY)),
('20250000005', 'Campus Infrastructure Development Plan', 'Strategic plan for building new facilities and renovating existing infrastructure over the next five years', 'Planning and Development', 1, 'forwarded', DATE_SUB(NOW(), INTERVAL 3 DAY)),
('20250000006', 'Monthly Financial Report - October 2025', 'Comprehensive financial report including budget allocations, expenses, and revenue for the month of October', 'Administration and Finance', 1, 'ended', DATE_SUB(NOW(), INTERVAL 4 DAY)),
('20250000007', 'Institute Memorandum - New Policies', 'Official memorandum regarding new institutional policies and procedures for all departments', 'Institute', 1, 'received', DATE_SUB(NOW(), INTERVAL 5 DAY)),
('20250000008', 'Course Syllabus - Advanced Database Systems', 'Updated course syllabus for Advanced Database Systems including learning objectives, assessments, and schedule', 'Academics', 1, 'ended', DATE_SUB(NOW(), INTERVAL 6 DAY)),
('20250000009', 'Extension Program - Rural Education Initiative', 'Proposal for extension program to provide educational services to rural communities in the region', 'Research and Extension', 1, 'received', DATE_SUB(NOW(), INTERVAL 7 DAY)),
('20250000010', 'Student Housing Application Form', 'New application form and requirements for student dormitory and housing services', 'Student Services', 1, 'ended', DATE_SUB(NOW(), INTERVAL 8 DAY)),
('20250000011', 'Strategic Planning Workshop Materials', 'Materials and agenda for the upcoming strategic planning workshop for institutional development', 'Planning and Development', 1, 'forwarded', DATE_SUB(NOW(), INTERVAL 9 DAY)),
('20250000012', 'Purchase Order - Office Equipment', 'Purchase order request for new office equipment including computers, printers, and furniture', 'Administration and Finance', 1, 'received', DATE_SUB(NOW(), INTERVAL 10 DAY)),
('20250000013', 'Board Meeting Minutes - September 2025', 'Official minutes from the board of directors meeting held in September 2025', 'Institute', 1, 'ended', DATE_SUB(NOW(), INTERVAL 11 DAY)),
('20250000014', 'Faculty Development Program', 'Program outline for faculty professional development and training workshops', 'Academics', 1, 'ended', DATE_SUB(NOW(), INTERVAL 12 DAY)),
('20250000015', 'Research Publication - Environmental Impact Study', 'Research paper on environmental impact assessment for publication in academic journal', 'Research and Extension', 1, 'forwarded', DATE_SUB(NOW(), INTERVAL 13 DAY)),
('20250000016', 'Student Counseling Services Report', 'Quarterly report on student counseling services, number of sessions, and program effectiveness', 'Student Services', 1, 'ended', DATE_SUB(NOW(), INTERVAL 14 DAY)),
('20250000017', 'Building Maintenance Schedule 2026', 'Annual maintenance schedule for all campus buildings and facilities', 'Planning and Development', 1, 'received', DATE_SUB(NOW(), INTERVAL 15 DAY)),
('20250000018', 'Payroll Processing - November 2025', 'Monthly payroll processing documentation and employee salary disbursement records', 'Administration and Finance', 1, 'ended', DATE_SUB(NOW(), INTERVAL 16 DAY)),
('20250000019', 'Institutional Accreditation Report', 'Comprehensive report on institutional accreditation status and compliance requirements', 'Institute', 1, 'ended', DATE_SUB(NOW(), INTERVAL 17 DAY)),
('20250000020', 'Examination Schedule - Final Exams', 'Schedule and guidelines for final examinations for all academic programs', 'Academics', 1, 'ended', DATE_SUB(NOW(), INTERVAL 18 DAY)),
('20250000021', 'Community Outreach Program Evaluation', 'Evaluation report on community outreach programs and their impact on local communities', 'Research and Extension', 1, 'forwarded', DATE_SUB(NOW(), INTERVAL 19 DAY)),
('20250000022', 'Student Activity Fund Allocation', 'Budget allocation and guidelines for student organization activities and events', 'Student Services', 1, 'ended', DATE_SUB(NOW(), INTERVAL 20 DAY));


