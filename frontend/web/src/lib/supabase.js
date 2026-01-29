import { createClient } from "@supabase/supabase-js";

// 🚀 Replace these with *your* actual keys
const supabaseUrl = "https://nlimdpmnscteaqtagdbz.supabase.co";  
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5saW1kcG1uc2N0ZWFxdGFnZGJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMzMxMDcsImV4cCI6MjA3ODcwOTEwN30.tagzGi_UBj0iQL6bv39yVcSIhdiogah_9VuIbflPi-g";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
