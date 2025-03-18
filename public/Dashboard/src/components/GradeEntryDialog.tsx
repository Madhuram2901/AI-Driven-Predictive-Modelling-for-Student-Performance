import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Subject {
  id: number;
  name: string;
  grades: Array<{ grade: string; semester: string }>;
}

interface GradeEntryDialogProps {
  subjects: Subject[];
  onAddGrade: (subject: string, grade: string, semester: string) => void;
}

export function GradeEntryDialog({ subjects, onAddGrade }: GradeEntryDialogProps) {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleAddGrade = () => {
    if (!selectedSubject || !selectedGrade || !selectedSemester) {
      alert('Please fill in all fields');
      return;
    }

    onAddGrade(selectedSubject, selectedGrade, selectedSemester);
    setSelectedSubject('');
    setSelectedGrade('');
    setSelectedSemester('');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add Grade</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Grade</DialogTitle>
          <DialogDescription>
            Select a subject and enter the grade for a specific semester.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Subject</label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(subject => (
                  <SelectItem key={subject.id} value={subject.name}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Grade</label>
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger>
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="S">S (95%)</SelectItem>
                <SelectItem value="A">A (90%)</SelectItem>
                <SelectItem value="B">B (85%)</SelectItem>
                <SelectItem value="C">C (80%)</SelectItem>
                <SelectItem value="D">D (75%)</SelectItem>
                <SelectItem value="E">E (70%)</SelectItem>
                <SelectItem value="F">F (65%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Semester</label>
            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger>
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fall 2023">Fall 2023</SelectItem>
                <SelectItem value="Spring 2024">Spring 2024</SelectItem>
                <SelectItem value="Summer 2024">Summer 2024</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAddGrade} className="w-full">
            Add Grade
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 