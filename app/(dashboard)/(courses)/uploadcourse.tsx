"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  GraduationCap,
  BookOpen,
  Upload,
  Plus,
  Minus,
  Loader2,
  File,
  FileText,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

interface FileWithPreview extends File {
  preview?: string;
}

interface Subject {
  name: string;
  notesFile?: FileWithPreview;
  fileSize?: string;
  fileType?: string;
  uploadProgress?: number;
  uploadStatus?: "idle" | "uploading" | "success" | "error";
  errorMessage?: string;
}

const engineeringYears = [
  "First Year",
  "Second Year",
  "Third Year",
  "Final Year",
];

const branches = [
  "Computer Engineering",
  "Information Technology",
  "Electronics & Telecommunication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
];

const acceptedFileTypes = [".pdf", ".doc", ".docx", ".ppt", ".pptx"];

export default function UploadPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [subjects, setSubjects] = useState<Subject[]>([
    { name: "", notesFile: undefined, uploadStatus: "idle", uploadProgress: 0 },
  ]);
  const [overallProgress, setOverallProgress] = useState<number>(0);
  const [recentUploads, setRecentUploads] = useState<
    { course: string; subject: string; url: string }[]
  >([]);

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Load recent uploads from localStorage on component mount
  useEffect(() => {
    const savedUploads = localStorage.getItem("recentUploads");
    if (savedUploads) {
      try {
        setRecentUploads(JSON.parse(savedUploads).slice(0, 3)); // Show only latest 3
      } catch (e) {
        console.error("Failed to parse recent uploads", e);
      }
    }
  }, []);

  // Add a new subject to the list
  const addSubject = () => {
    setSubjects([
      ...subjects,
      {
        name: "",
        notesFile: undefined,
        uploadStatus: "idle",
        uploadProgress: 0,
      },
    ]);
  };

  // Remove a subject from the list
  const removeSubject = (index: number) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter((_, i) => i !== index));
    }
  };

  // Update a subject's properties
  const updateSubject = (
    index: number,
    field: keyof Subject,
    value: string
  ) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index] = { ...updatedSubjects[index], [field]: value };
    setSubjects(updatedSubjects);
  };

  // Format file size to a human-readable string
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Handle file selection
  const handleFileChange =
    (subjectIndex: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) return;

      const file = e.target.files[0] as FileWithPreview;
      const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;

      // Validate file type
      if (!acceptedFileTypes.includes(fileExtension)) {
        toast.error(
          `Invalid file type. Accepted types: ${acceptedFileTypes.join(", ")}`
        );
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size exceeds 10MB limit");
        return;
      }

      const updatedSubjects = [...subjects];
      updatedSubjects[subjectIndex] = {
        ...updatedSubjects[subjectIndex],
        notesFile: file,
        fileSize: formatFileSize(file.size),
        fileType: fileExtension.slice(1).toUpperCase(),
        uploadStatus: "idle",
        uploadProgress: 0,
      };
      setSubjects(updatedSubjects);
    };

  // Update the upload progress for a specific subject
  const updateUploadProgress = (index: number, progress: number) => {
    setSubjects((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        uploadProgress: progress,
        uploadStatus: progress === 100 ? "success" : "uploading",
      };
      return updated;
    });

    // Update overall progress
    const total = subjects.length;
    const progressSum = subjects.reduce((sum, s, i) => {
      return sum + (i === index ? progress : s.uploadProgress || 0);
    }, 0);

    setOverallProgress(progressSum / total);
  };

  // Save a recent upload to localStorage
  const saveRecentUpload = (course: string, subject: string, url: string) => {
    const newUpload = { course, subject, url };
    const updatedUploads = [newUpload, ...recentUploads].slice(0, 3);
    setRecentUploads(updatedUploads);
    localStorage.setItem("recentUploads", JSON.stringify(updatedUploads));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedYear || !selectedBranch) {
      toast.error("Please select year and branch");
      return;
    }

    const validSubjects = subjects.filter(
      (subject) => subject.name.trim() && subject.notesFile
    );
    if (validSubjects.length === 0) {
      toast.error("Please add at least one subject with a name and notes file");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Preparing to upload files...");

    try {
      const formData = new FormData();
      formData.append("year", selectedYear);
      formData.append("branch", selectedBranch);

      // We need to prepare a simplified version of subjects without the File objects
      // as they can't be stringified directly
      const subjectsToSave = subjects
        .filter((subject) => subject.name.trim() && subject.notesFile)
        .map((subject) => ({
          name: subject.name.trim(),
        }));

      formData.append("subjects", JSON.stringify(subjectsToSave));

      // Add files to form data
      subjects.forEach((subject, subjectIndex) => {
        if (subject.name.trim() && subject.notesFile) {
          formData.append(
            `notes-file-${subjectIndex}`,
            subject.notesFile,
            subject.notesFile.name
          );

          // Mark this subject as uploading
          const updatedSubjects = [...subjects];
          updatedSubjects[subjectIndex] = {
            ...updatedSubjects[subjectIndex],
            uploadStatus: "uploading",
          };
          setSubjects(updatedSubjects);
        }
      });

      toast.dismiss(toastId);
      toast.loading("Uploading files to Cloudinary...");

      // Use the fetch with a custom header to track upload progress
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/course", true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setOverallProgress(percentComplete);

          // For simplicity, update all valid subjects with the same progress
          subjects.forEach((subject, idx) => {
            if (subject.name.trim() && subject.notesFile) {
              updateUploadProgress(idx, percentComplete);
            }
          });
        }
      };

      xhr.onload = function () {
        if (xhr.status === 201) {
          const response = JSON.parse(xhr.responseText);

          toast.success("Notes uploaded successfully!");

          // Save upload information for recent uploads display
          if (response.course && response.course.subjects) {
            response.course.subjects.forEach((subj: any) => {
              const courseName = `${selectedYear} - ${selectedBranch}`;
              saveRecentUpload(courseName, subj.name, subj.notesFileUrl);
            });
          }

          // Reset form
          setSelectedYear("");
          setSelectedBranch("");
          setSubjects([
            {
              name: "",
              notesFile: undefined,
              uploadStatus: "idle",
              uploadProgress: 0,
            },
          ]);
          setOverallProgress(0);
        } else {
          throw new Error("Failed to upload notes");
        }
        setIsLoading(false);
      };

      xhr.onerror = function () {
        toast.error("Failed to upload notes. Please try again.");
        setIsLoading(false);

        // Mark all uploading subjects as failed
        setSubjects((prev) =>
          prev.map((s) =>
            s.uploadStatus === "uploading"
              ? { ...s, uploadStatus: "error", errorMessage: "Upload failed" }
              : s
          )
        );
      };

      xhr.send(formData);
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Failed to upload notes. Please try again.");
      console.error("Upload error:", error);
      setIsLoading(false);
    }
  };

  // Trigger the hidden file input
  const triggerFileInput = (inputId: string) => {
    if (fileInputRefs.current[inputId]) {
      fileInputRefs.current[inputId]?.click();
    }
  };

  return (
    <div className="min-h-screen py-12 max-w-4xl mx-auto px-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-none shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="text-3xl font-bold text-center">
              Upload Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-6 w-6 text-primary" />
                <div className="flex-1">
                  <Label htmlFor="year">Academic Year</Label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger id="year">
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {engineeringYears.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <div className="flex-1">
                  <Label htmlFor="branch">Branch</Label>
                  <Select
                    value={selectedBranch}
                    onValueChange={setSelectedBranch}
                  >
                    <SelectTrigger id="branch">
                      <SelectValue placeholder="Select Branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem key={branch} value={branch}>
                          {branch}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {subjects.map((subject, subjectIndex) => (
          <Card
            key={subjectIndex}
            className={`transition-all duration-200 ${
              subject.uploadStatus === "success"
                ? "border-green-500 bg-green-50"
                : subject.uploadStatus === "error"
                ? "border-red-500 bg-red-50"
                : ""
            }`}
          >
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label htmlFor={`subject-${subjectIndex}`}>
                      Subject Name
                    </Label>
                    <Input
                      id={`subject-${subjectIndex}`}
                      value={subject.name}
                      onChange={(e) =>
                        updateSubject(subjectIndex, "name", e.target.value)
                      }
                      placeholder="Enter subject name"
                      className={
                        subject.uploadStatus === "success"
                          ? "border-green-500"
                          : ""
                      }
                      disabled={
                        subject.uploadStatus === "success" ||
                        subject.uploadStatus === "uploading"
                      }
                    />
                  </div>
                  {subjects.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeSubject(subjectIndex)}
                      disabled={subject.uploadStatus === "uploading"}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Notes File</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-1"
                          >
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Accepted file types: PDF, DOC, DOCX, PPT, PPTX</p>
                          <p>Maximum file size: 10MB</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex space-x-2 items-center">
                    <input
                      type="file"
                      id={`notes-file-${subjectIndex}`}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                      onChange={handleFileChange(subjectIndex)}
                      ref={(el) =>
                        (fileInputRefs.current[`notes-file-${subjectIndex}`] =
                          el)
                      }
                      disabled={
                        subject.uploadStatus === "uploading" ||
                        subject.uploadStatus === "success"
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        triggerFileInput(`notes-file-${subjectIndex}`)
                      }
                      disabled={
                        subject.uploadStatus === "uploading" ||
                        subject.uploadStatus === "success"
                      }
                      className={subject.notesFile ? "bg-blue-50" : ""}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      {subject.notesFile ? "Change File" : "Upload File"}
                    </Button>

                    {subject.uploadStatus === "success" && (
                      <span className="text-green-500 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Uploaded
                      </span>
                    )}

                    {subject.uploadStatus === "error" && (
                      <span className="text-red-500 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        {subject.errorMessage || "Failed"}
                      </span>
                    )}
                  </div>

                  {subject.notesFile && (
                    <div className="bg-slate-50 p-3 rounded-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <File className="h-4 w-4 mr-2 text-blue-500" />
                          <span className="text-sm font-medium truncate max-w-[250px]">
                            {subject.notesFile.name}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {subject.fileSize} | {subject.fileType}
                        </div>
                      </div>

                      {subject.uploadStatus === "uploading" && (
                        <div className="mt-2">
                          <Progress
                            value={subject.uploadProgress}
                            className="h-2"
                          />
                          <div className="text-xs text-right mt-1">
                            {Math.round(subject.uploadProgress || 0)}%
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="flex gap-4 flex-col">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={addSubject}
            disabled={isLoading}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Subject
          </Button>

          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600"
            disabled={isLoading || !subjects.some((s) => s.name && s.notesFile)}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading... {Math.round(overallProgress)}%
              </>
            ) : (
              <>
                Upload Notes
                <Upload className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </div>

        {isLoading && (
          <div className="mt-4">
            <Progress value={overallProgress} className="h-2" />
            <p className="text-sm text-center mt-2 text-muted-foreground">
              Uploading to Cloudinary... {Math.round(overallProgress)}%
            </p>
          </div>
        )}

        {recentUploads.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg">Recent Uploads</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {recentUploads.map((upload, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center p-3 bg-slate-50 rounded-md"
                  >
                    <div>
                      <p className="font-medium">{upload.subject}</p>
                      <p className="text-sm text-muted-foreground">
                        {upload.course}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={upload.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </a>
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  );
}
