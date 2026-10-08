-- Extra context for website enquiries.
ALTER TABLE contact_requests ADD COLUMN IF NOT EXISTS organization varchar(160);
ALTER TABLE contact_requests ADD COLUMN IF NOT EXISTS topic varchar(40);
