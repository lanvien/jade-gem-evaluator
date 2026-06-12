
CREATE POLICY "Anyone can read jade-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'jade-images');

CREATE POLICY "Anyone can upload to jade-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'jade-images');
