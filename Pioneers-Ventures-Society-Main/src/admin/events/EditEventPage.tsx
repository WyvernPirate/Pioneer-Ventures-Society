import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from "@/components/ui/calender";
import { Calendar as CalendarIcon, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

interface EventData {
  title: string;
  date: Timestamp;
  time: string;
  location: string;
  description: string;
  image: string;
  type: string;
  registrationLink?: string;
}

export default function EditEventPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    time: '',
    location: '',
    description: '',
    image: '',
    type: '',
    registrationLink: '',
  });
  const [date, setDate] = useState<Date | undefined>();

  useEffect(() => {
    if (!eventId) {
      setError("Event ID is missing from URL.");
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      const db = getFirestore();
      const eventDocRef = doc(db, 'events', eventId);
      try {
        const docSnap = await getDoc(eventDocRef);
        if (docSnap.exists()) {
          const eventData = docSnap.data() as EventData;
          setFormData({
            title: eventData.title || '',
            time: eventData.time || '',
            location: eventData.location || '',
            description: eventData.description || '',
            image: eventData.image || '',
            type: eventData.type || '',
            registrationLink: eventData.registrationLink || '',
          });
          setDate(eventData.date.toDate());
        } else {
          setError("Event not found. It may have been deleted.");
        }
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Failed to load event data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventId || !date) {
      setError("Cannot submit, event ID or date is missing.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const db = getFirestore();
      const eventDocRef = doc(db, 'events', eventId);
      const updatedEvent = {
        ...formData,
        date: Timestamp.fromDate(date),
      };
      await updateDoc(eventDocRef, updatedEvent);
      navigate('/dashboard/events');
    } catch (err) {
      console.error("Error updating event:", err);
      setError("Failed to update event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <div className="space-y-4 p-6 border rounded-lg">
          {[...Array(7)].map((_, i) => <div key={i} className="grid grid-cols-4 items-center gap-4"><Skeleton className="h-6 w-20" /><Skeleton className="h-10 col-span-3" /></div>)}
          <div className="flex justify-end gap-2 pt-4"><Skeleton className="h-10 w-24" /><Skeleton className="h-10 w-24" /></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="flex items-center p-4 bg-destructive/10 text-destructive rounded-lg"><AlertCircle className="h-5 w-5 mr-3" /><p>{error}</p></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4" /></Button>
        <h1 className="text-3xl font-bold text-primary">Edit Event</h1>
      </div>
      <form onSubmit={handleSubmit} className="p-6 border rounded-lg bg-card">
        <div className="grid gap-6">
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="title" className="text-right">Title</Label><Input id="title" value={formData.title} onChange={handleInputChange} className="col-span-3" required /></div>
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="date" className="text-right">Date</Label>
            <Popover>
              <PopoverTrigger asChild><Button variant={"outline"} className={cn("w-[280px] justify-start text-left font-normal", !date && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{date ? format(date, "PPP") : <span>Pick a date</span>}</Button></PopoverTrigger>
              <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={date} onSelect={setDate} initialFocus /></PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="time" className="text-right">Time</Label><Input id="time" value={formData.time} onChange={handleInputChange} placeholder="e.g., 9:00 AM - 5:00 PM" className="col-span-3" /></div>
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="location" className="text-right">Location</Label><Input id="location" value={formData.location} onChange={handleInputChange} className="col-span-3" /></div>
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="type" className="text-right">Type</Label><Input id="type" value={formData.type} onChange={handleInputChange} placeholder="e.g., Summit, Workshop" className="col-span-3" /></div>
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="description" className="text-right">Description</Label><Textarea id="description" value={formData.description} onChange={handleInputChange} className="col-span-3" /></div>
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="image" className="text-right">Image URL</Label><Input id="image" value={formData.image} onChange={handleInputChange} className="col-span-3" /></div>
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="registrationLink" className="text-right">Registration Link</Label><Input id="registrationLink" value={formData.registrationLink} onChange={handleInputChange} placeholder="Optional: /register/event-slug" className="col-span-3" /></div>
        </div>
        <div className="flex justify-end gap-2 pt-6">
          <Button type="button" variant="outline" onClick={() => navigate('/dashboard/events')}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}