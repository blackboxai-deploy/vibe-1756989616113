"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface FormData {
  name: string;
  email: string;
  phone: string;
  courseId: string;
  courseName: string;
  education: string;
  qualifications: string;
  resume: File | null;
  message: string;
}

const courses = [
  { id: 'web-dev', name: 'Full Stack Web Development', price: 2999 },
  { id: 'data-science', name: 'Data Science & Analytics', price: 3499 },
  { id: 'digital-marketing', name: 'Digital Marketing Mastery', price: 1999 },
  { id: 'ux-design', name: 'UX/UI Design Principles', price: 2499 },
  { id: 'mobile-dev', name: 'Mobile App Development', price: 3299 },
  { id: 'project-mgmt', name: 'Project Management', price: 2499 },
];

export default function ApplicationForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    courseId: '',
    courseName: '',
    education: '',
    qualifications: '',
    resume: null,
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [currentStep, setCurrentStep] = useState(1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCourseChange = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    setFormData(prev => ({
      ...prev,
      courseId,
      courseName: course?.name || ''
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      resume: file
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      // For demo purposes, we'll just show success
      // In a real app, this would upload to a cloud storage and submit to API

      const submitData = {
        ...formData,
        resumeUrl: formData.resume ? 'uploaded-resume-url' : null
      };

      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Application submitted successfully! We will contact you within 24 hours.'
        });
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          courseId: '',
          courseName: '',
          education: '',
          qualifications: '',
          resume: null,
          message: ''
        });
        setCurrentStep(1);
      } else {
        throw new Error(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Application submission error:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Failed to submit application. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const progress = (currentStep / 3) * 100;

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">Apply Now</CardTitle>
        <p className="text-gray-600 text-center mb-4">
          Take the first step towards advancing your career
        </p>
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-gray-500 text-center mt-2">
          Step {currentStep} of 3
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStep === 1 && (
            <>
              <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="courseId">Select Course *</Label>
                <Select onValueChange={handleCourseChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name} - ${course.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="button" onClick={nextStep} className="w-full">
                Next Step ›
              </Button>
            </>
          )}

          {currentStep === 2 && (
            <>
              <h3 className="text-xl font-semibold mb-4">Education Details</h3>
              <div className="space-y-2">
                <Label htmlFor="education">Education Level *</Label>
                <Select onValueChange={(value) => setFormData(prev => ({...prev, education: value}))} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high-school">High School</SelectItem>
                    <SelectItem value="associate">Associate Degree</SelectItem>
                    <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                    <SelectItem value="masters">Master's Degree</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="qualifications">Relevant Qualifications/Skills</Label>
                <Textarea
                  id="qualifications"
                  name="qualifications"
                  placeholder="List any relevant qualifications, skills, or previous learning..."
                  rows={4}
                  value={formData.qualifications}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resume">Resume/CV</Label>
                <Input
                  id="resume"
                  name="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
                <p className="text-sm text-gray-500">
                  Upload your resume (PDF, DOC, DOCX - Max 5MB)
                </p>
              </div>

              <div className="flex space-x-4">
                <Button type="button" onClick={prevStep} variant="outline">
                  ← Previous
                </Button>
                <Button type="button" onClick={nextStep} className="flex-1">
                  Next Step ›
                </Button>
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <h3 className="text-xl font-semibold mb-4">Final Details</h3>
              <div className="space-y-2">
                <Label htmlFor="message">Additional Information</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Why do you want to take this course? Any specific goals or questions..."
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                />
              </div>

              {submitStatus.message && (
                <div className={`p-4 rounded-lg ${
                  submitStatus.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {submitStatus.message}
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Application Summary</h4>
                <p><strong>Course:</strong> {formData.courseName}</p>
                <p><strong>Education:</strong> {formData.education}</p>
                <p><strong>Resume:</strong> {formData.resume ? formData.resume.name : 'Not provided'}</p>
              </div>

              <div className="flex space-x-4">
                <Button type="button" onClick={prevStep} variant="outline">
                  ← Previous
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting || !formData.courseId}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  );
}