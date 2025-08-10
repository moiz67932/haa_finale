-- Create function to increment upvotes
CREATE OR REPLACE FUNCTION increment_upvotes(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.community_posts 
  SET upvotes = upvotes + 1 
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION increment_upvotes(UUID) TO authenticated;
