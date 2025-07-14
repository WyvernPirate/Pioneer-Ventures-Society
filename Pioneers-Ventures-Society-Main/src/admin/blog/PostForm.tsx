import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export interface PostFormData {
    title: string;
    content: string;
    image: string;
    author: string;
}

interface PostFormProps {
    formData: PostFormData;
    onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onImageFileChange: (file: File | null) => void;
    imageFile: File | null;
}

export const PostForm = ({ formData, onFormChange, onImageFileChange, imageFile }: PostFormProps) => {
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
            <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="content" className="text-right pt-2">Content</Label>
                <Textarea
                    id="content"
                    value={formData.content}
                    onChange={onFormChange}
                    className="col-span-3 min-h-[250px]"
                    placeholder="Write your post content here. Markdown is supported."
                    required
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image-upload" className="text-right">Image</Label>
                <div className="col-span-3">
                    <div className="flex items-center gap-4">
                        {formData.image && <img src={formData.image} alt="Current post" className="h-20 w-20 object-cover rounded-md border" />}
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
                <Label htmlFor="author" className="text-right">Author</Label>
                <Input
                    id="author"
                    value={formData.author}
                    onChange={onFormChange}
                    className="col-span-3"
                />
            </div>
        </div>
    );
};