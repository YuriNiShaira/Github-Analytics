from supabase import create_client, Client
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class SupabaseService:
    """Helper service for Supabase features (optional)"""
    
    def __init__(self):
        if hasattr(settings, 'SUPABASE_URL') and settings.SUPABASE_URL:
            self.client: Client = create_client(
                settings.SUPABASE_URL,
                settings.SUPABASE_SERVICE_KEY
            )
        else:
            self.client = None
            logger.warning("Supabase client not configured")
    
    def get_client(self):
        return self.client
    
    def save_to_storage(self, file_content, file_name, bucket="analytics"):
        """Save PDF reports or exports to Supabase Storage"""
        if not self.client:
            raise Exception("Supabase client not configured")
        
        # Upload to storage bucket
        response = self.client.storage.from_(bucket).upload(
            file_name, 
            file_content
        )
        return response
    
    def get_public_url(self, bucket, file_path):
        """Get public URL for stored file"""
        if not self.client:
            raise Exception("Supabase client not configured")
        
        return self.client.storage.from_(bucket).get_public_url(file_path)