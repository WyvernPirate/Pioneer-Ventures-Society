import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { EventForm, type EventFormData } from '@/admin/events/EventForm';

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

interface FirestoreEventData extends Omit<EventData, 'date'> {
  date: Timestamp;
}


export default function EditEventPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    time: '',
    location: '',
    description: '',
    image: '',
    type: '',
    registrationLink: '',
  });
  const [date, setDate] = useState<Date | undefined>();
  const [imageFile, setImageFile] = useState<File | null>(null);

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
          const eventData = docSnap.data() as FirestoreEventData;
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

  const handleDescriptionChange = (value: string) => {
    setFormData(prev => ({ ...prev, description: value }));
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
      const storage = getStorage();
      const eventDocRef = doc(db, 'events', eventId);

      let imageUrl = formData.image;
      if (imageFile) {
        const storageRef = ref(storage, `events/pics/${Date.now()}-${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const updatedEvent = {
        ...formData,
        image: imageUrl,
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
        <EventForm
          formData={formData}
          onFormChange={handleInputChange}
          onDescriptionChange={handleDescriptionChange}
          date={date}
          onDateChange={setDate}
          imageFile={imageFile}
          onImageFileChange={setImageFile}
        />
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