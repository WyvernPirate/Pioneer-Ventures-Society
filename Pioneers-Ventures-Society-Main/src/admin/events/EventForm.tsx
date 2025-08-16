import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calender";
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export interface EventFormData {
    title: string;
    time: string;
    location: string;
    description: string;
    image: string;
    type: string;
    registrationLink: string;
}

interface EventFormProps {
    formData: EventFormData;
    onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onDescriptionChange: (description: string) => void;
    date: Date | undefined;
    onDateChange: (date: Date | undefined) => void;
    onImageFileChange: (file: File | null) => void;
    imageFile: File | null;
}

export const EventForm = ({ formData, onFormChange, onDescriptionChange, date, onDateChange, onImageFileChange, imageFile }: EventFormProps) => {
    return (
        <div className="grid gap-6">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title</Label>
                <Input
                    id="title"
                    value={formData.title}
                    onChange={onFormChange}
                    className="col-span-3"
                    required
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-[280px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={date} onSelect={onDateChange} initialFocus />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">Time</Label>
                <Input
                    id="time"
                    value={formData.time}
                    onChange={onFormChange}
                    placeholder="e.g., 9:00 AM - 5:00 PM"
                    className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">Location</Label>
                <Input
                    id="location"
                    value={formData.location}
                    onChange={onFormChange}
                    className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">Type</Label>
                <Input
                    id="type"
                    value={formData.type}
                    onChange={onFormChange}
                    placeholder="e.g., Summit, Workshop"
                    className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">Description</Label>
                <div className="col-span-3">
                    <RichTextEditor
                        value={formData.description}
                        onChange={onDescriptionChange}
                    />
                </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image-upload" className="text-right">Image</Label>
                <div className="col-span-3">
                    <div className="flex items-center gap-4">
                        {formData.image && <img src={formData.image} alt="Current event" className="h-20 w-20 object-cover rounded-md border" />}
                        <Input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files && onImageFileChange(e.target.files[0])}
                        />
                    </div>
                    {imageFile && <p className="text-sm text-muted-foreground mt-2">New image selected: {imageFile.name}</p>}
                </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="registrationLink" className="text-right">Registration Link</Label>
                <Input
                    id="registrationLink"
                    value={formData.registrationLink}
                    onChange={onFormChange}
                    placeholder="Optional: /register/event-slug"
                    className="col-span-3"
                />
            </div>
        </div>
    );
};