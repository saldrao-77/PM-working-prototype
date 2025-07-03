"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Zap, 
  StickyNote, 
  FileText, 
  ChevronLeft, 
  Settings, 
  Eye, 
  Trash2, 
  MessageSquare, 
  Paperclip,
  Calendar,
  DollarSign,
  User,
  Building,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Edit,
  Plus,
  Download,
  Send,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { jobsList, activityMilestones, jobNotes, activityFiles } from "@/app/mockData";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

// Mock transactions for this work order
const workOrderTransactions = [
  {
    id: 'txn1',
    date: '2024-03-15',
    vendor: 'Home Depot',
    amount: 150.00,
    status: 'reconciled',
    billable: true,
    jobId: 'job1',
    madeBy: 'John Smith',
    memo: 'HVAC parts',
    receipt: 'receipt1.pdf'
  },
  {
    id: 'txn2',
    date: '2024-03-16',
    vendor: 'Lowes',
    amount: 75.50,
    status: 'pending',
    billable: true,
    jobId: 'job1',
    madeBy: 'Sarah Johnson',
    memo: 'Paint supplies',
    receipt: 'receipt2.pdf'
  },
  {
    id: 'txn3',
    date: '2024-03-17',
    vendor: 'Ace Hardware',
    amount: 45.25,
    status: 'reconciled',
    billable: false,
    jobId: 'job1',
    madeBy: 'John Smith',
    memo: 'Tools',
    receipt: 'receipt3.pdf'
  }
];

export default function WorkOrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params?.jobId as string;
  const job = jobsList.find(j => j.id === jobId);
  
  // Get current role from URL or localStorage (for demo purposes)
  const [currentRole, setCurrentRole] = useState('pm'); // Default to PM for demo
  
  // Check if user is a technician
  const isTechnician = currentRole === 'technician';
  
  const [activeTab, setActiveTab] = useState(isTechnician ? "details" : "timeline");
  const [editMode, setEditMode] = useState(false);
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [approvalFiles, setApprovalFiles] = useState<{ [jobId: string]: File | null }>({});
  const [approvalHistory, setApprovalHistory] = useState<{ 
    [jobId: string]: { 
      status: string; 
      date: string; 
      evidence?: string;
      reminders?: Array<{ type: string; date: string; message: string }>;
      fileUploads?: Array<{ date: string; filename: string }>;
    } 
  }>({});
  const [localJobNotes, setLocalJobNotes] = useState<{ [jobId: string]: { author: string, content: string, timestamp: string }[] }>({});
  const [reminderCount, setReminderCount] = useState(1);
  const [filePreviewDialogOpen, setFilePreviewDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ filename: string; date: string } | null>(null);
  
  // State for Smart Assist chat
  const [smartAssistInput, setSmartAssistInput] = useState("");
  const [smartAssistChat, setSmartAssistChat] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [smartAssistOpen, setSmartAssistOpen] = useState(false);
  
  // State for new activity dialog
  const [newActivityDialogOpen, setNewActivityDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState("");
  const [activityFile, setActivityFile] = useState<File | null>(null);
  
  // Available activities for PM to add
  const availableActivities = [
    'Work Order Received',
    'Pre-Approval Sent', 
    'Pre-Approval Received',
    'Work Order Update',
    'Work Order Closed'
  ];

  // Add state for new expense dialog
  const [newExpenseDialogOpen, setNewExpenseDialogOpen] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    vendor: '',
    amount: '',
    madeBy: '',
    billable: true,
    memo: '',
    receipt: ''
  });

  // Add state for photos functionality
  const [photos, setPhotos] = useState<{ id: string; filename: string; uploadedBy: string; date: string; url: string }[]>([]);
  const [uploadPhotoDialogOpen, setUploadPhotoDialogOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<{ id: string; filename: string; uploadedBy: string; date: string; url: string } | null>(null);
  const [photoPreviewDialogOpen, setPhotoPreviewDialogOpen] = useState(false);

  // Add state for work order submission
  const [workOrderSubmitted, setWorkOrderSubmitted] = useState(false);

  // Detect current role from URL parameters or localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const roleFromUrl = urlParams.get('role');
    const roleFromStorage = localStorage.getItem('currentRole');
    const detectedRole = roleFromUrl || roleFromStorage || 'pm';
    setCurrentRole(detectedRole);
    
    // Update active tab based on role
    if (detectedRole === 'technician') {
      setActiveTab('details');
    } else {
      setActiveTab('timeline');
    }
  }, []);

  // Initialize notes for this job if not exists
  useEffect(() => {
    if (job && !localJobNotes[job.id]) {
      setLocalJobNotes(prev => ({
        ...prev,
        [job.id]: jobNotes[job.id] || []
      }));
    }
  }, [job, jobNotes, localJobNotes]);

  const addNote = (content: string) => {
    if (!job || !content.trim()) return;
    
    const newNote = {
      author: 'Property Manager', // You can make this dynamic based on user role
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };

    setLocalJobNotes(prev => ({
      ...prev,
      [job.id]: [
        ...(prev[job.id] || []),
        newNote
      ]
    }));
  };

  // Calculate work order progress based on milestones and activities
  const calculateProgress = () => {
    if (!job) return 0;
    
    // Define the expected milestones for a work order
    const expectedMilestones = [
      'Work Order Created',
      'Work Started', 
      'Work Order Update',
      'Work Completed'
    ];
    
    // Count completed milestones (for demo, we'll simulate some progress)
    // In a real app, this would check actual milestone completion status
    const completedMilestones = 3; // Simulating 3 out of 4 milestones completed
    
    // Calculate percentage
    const progress = Math.round((completedMilestones / expectedMilestones.length) * 100);
    return Math.min(progress, 100); // Ensure it doesn't exceed 100%
  };

  const workOrderProgress = calculateProgress();

  function handleSmartAssistSend() {
    if (!smartAssistInput.trim()) return;
    setSmartAssistChat((prev) => [
      ...prev,
      { role: 'user', content: smartAssistInput.trim() },
      { role: 'assistant', content: `This is a mock answer to: "${smartAssistInput.trim()}". (LLM integration coming soon!)` }
    ]);
    setSmartAssistInput("");
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Work Order Not Found</h1>
          <Button
            variant="ghost"
            onClick={() => router.push('/?tab=workorders')}
            className="text-gray-300 hover:text-white hover:bg-blue-600/20 border border-transparent hover:border-blue-500/30"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Work Orders
          </Button>
        </div>
      </div>
    );
  }

  // Timeline logic
  type MilestoneEvent = { type: 'milestone'; milestone: string; owner: string; date: string; notes: string; fileKey: string };
  type NoteEvent = { type: 'note'; author: string; content: string; date: string };
  const milestones: MilestoneEvent[] = activityMilestones
    .map(milestone => {
      const activityRows = [
        {
          ...milestone,
          job,
          date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          notes: '',
          fileKey: `${job.id}-${milestone.milestone.toLowerCase().replace(/\s+/g, '-')}`
        }
      ];
      return activityRows.length > 0 ? {
        type: 'milestone' as const,
        milestone: milestone.milestone,
        owner: milestone.owner,
        date: activityRows[0].date,
        notes: activityRows[0].notes,
        fileKey: activityRows[0].fileKey
      } : null;
    })
    .filter((m): m is MilestoneEvent => m !== null);
  const notes: NoteEvent[] = (jobNotes[job.id] || []).map(note => ({
    type: 'note',
    author: note.author,
    content: note.content,
    date: note.timestamp
  }));
  const allEvents: Array<MilestoneEvent | NoteEvent> = [
    ...milestones,
    ...notes
  ];
  allEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Approved</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "High":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">High</Badge>;
      case "Medium":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Medium</Badge>;
      case "Low":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Low</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  // Handle approval actions
  const handleApprove = () => {
    if (!approvalFiles[job.id]) return;
    setApprovalHistory(prev => ({
      ...prev,
      [job.id]: {
        status: 'approved',
        date: new Date().toISOString(),
        evidence: approvalFiles[job.id]?.name
      }
    }));
    // In a real app, you'd update the job status here
  };

  const handleReject = () => {
    setApprovalHistory(prev => ({
      ...prev,
      [job.id]: {
        status: 'rejected',
        date: new Date().toISOString()
      }
    }));
    // In a real app, you'd update the job status here
  };

  const handleRequestMoreInfo = () => {
    // In a real app, you'd send a notification or email
    alert('Request for more information sent to owner');
  };

  // Handle work order submission by technician
  const handleSubmitWorkOrder = () => {
    setWorkOrderSubmitted(true);
    // In a real app, you'd send a notification to the PM and update the work order status
    alert('Work Order submitted successfully! The Property Manager has been notified.');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-xl font-bold text-white">{job.property}</h1>
                <p className="text-sm text-gray-400">{job.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                onClick={() => router.push('/?tab=workorders')}
                className="text-gray-300 hover:text-white hover:bg-blue-600/20 border border-transparent hover:border-blue-500/30"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Work Orders
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Job Details */}
            <div className="lg:col-span-1 space-y-6">
              {/* Comprehensive Job Overview Card */}
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    Work Order Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-800 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-400">3</div>
                      <div className="text-xs text-gray-400">Days Open</div>
                    </div>
                    <div className="p-3 bg-gray-800 rounded-lg text-center">
                      <div className="text-lg font-bold text-red-400">{job.priority}</div>
                      <div className="text-xs text-gray-400">Priority</div>
                    </div>
                  </div>

                  {/* Job Details */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <Label className="text-gray-400">Requested</Label>
                      <span className="text-white">{job.requested}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <Label className="text-gray-400">Owner</Label>
                      <span className="text-white">{job.owner}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <Label className="text-gray-400">Technician</Label>
                      <span className="text-white">John Smith</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <Label className="text-gray-400">Last Updated</Label>
                      <span className="text-white">2 hours ago</span>
                    </div>
                    {isTechnician && workOrderSubmitted && (
                      <div className="flex justify-between items-center text-sm">
                        <Label className="text-gray-400">Status</Label>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                          Submitted for Review
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Initial Notes Section */}
                  {job.notes && (
                    <div className="pt-4 border-t border-gray-700">
                      <Label className="text-gray-400 text-sm font-medium mb-2 block">Initial Notes</Label>
                      <div className="p-3 bg-gray-800 rounded-lg">
                        <p className="text-sm text-gray-200">{job.notes}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Cost Section */}
                  {job.cost && (
                    <div className="pt-4 border-t border-gray-700">
                      <div className="flex justify-between items-center mb-2">
                        <Label className="text-gray-400">Estimated Cost</Label>
                        <span className="text-2xl font-bold text-white">${job.cost.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${workOrderProgress}%` }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>Spent: $225</span>
                        <span>Remaining: ${(job.cost - 225).toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="pt-4 border-t border-gray-700">
                    <div className="grid grid-cols-1 gap-2">
                      {isTechnician ? (
                        <Button 
                          size="sm" 
                          className={workOrderSubmitted ? "bg-gray-600 text-gray-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"}
                          onClick={handleSubmitWorkOrder}
                          disabled={workOrderSubmitted}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {workOrderSubmitted ? "Work Order Submitted" : "Submit Work Order"}
                        </Button>
                      ) : (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Close Work Order
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Timeline and Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tabs */}
              <div className="flex space-x-1 bg-gray-900 rounded-lg p-1">
                {[
                  // Only show Approval Status tab for non-technicians
                  ...(isTechnician ? [] : [{ id: 'timeline', label: 'Approval Status', icon: Clock }]),
                  { id: 'details', label: 'Activities', icon: FileText },
                  { id: 'expenses', label: 'Expenses', icon: DollarSign },
                  { id: 'notes', label: 'Notes', icon: StickyNote },
                  { id: 'photos', label: 'Photos', icon: Eye }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                      activeTab === tab.id ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white hover:bg-gray-800"
                    )}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === 'timeline' && (
                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Approval Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Approval Timeline Table */}
                    {job.cost && job.cost >= 1000 && (
                      <div className="space-y-3">
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-sm">
                            <thead>
                              <tr className="bg-gray-800 border-b border-gray-700">
                                <th className="text-left py-3 px-4 font-semibold text-white">Date</th>
                                <th className="text-left py-3 px-4 font-semibold text-white">Action</th>
                                <th className="text-left py-3 px-4 font-semibold text-white">Status</th>
                                <th className="text-left py-3 px-4 font-semibold text-white">Details</th>
                              </tr>
                            </thead>
                            <tbody>
                              {/* Initial Request */}
                              <tr className="bg-gray-900 border-b border-gray-800">
                                <td className="py-3 px-4 text-gray-300">
                                  {new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString()} at 10:30 AM
                                </td>
                                <td className="py-3 px-4 text-gray-300">Approval Request Sent</td>
                                <td className="py-3 px-4">
                                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">Sent</Badge>
                                </td>
                                <td className="py-3 px-4 text-gray-300">Initial approval request sent to owner</td>
                              </tr>

                              {/* Follow-up Reminder */}
                              <tr className="bg-gray-900 border-b border-gray-800">
                                <td className="py-3 px-4 text-gray-300">
                                  {new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString()} at 2:15 PM
                                </td>
                                <td className="py-3 px-4 text-gray-300">Follow-up Reminder Sent</td>
                                <td className="py-3 px-4">
                                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">Reminder</Badge>
                                </td>
                                <td className="py-3 px-4 text-gray-300">First follow-up reminder sent</td>
                              </tr>

                              {/* Additional Reminders */}
                              {approvalHistory[job.id]?.reminders?.map((reminder, index) => (
                                <tr key={index} className="bg-gray-900 border-b border-gray-800">
                                  <td className="py-3 px-4 text-gray-300">
                                    {new Date(reminder.date).toLocaleDateString()} at {new Date(reminder.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                  </td>
                                  <td className="py-3 px-4 text-gray-300">
                                    {reminder.type === 'new_approval_request' ? 'New Approval Request Sent' : 'Follow-up Reminder Sent'}
                                  </td>
                                  <td className="py-3 px-4">
                                    {reminder.type === 'new_approval_request' ? (
                                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">New Request</Badge>
                                    ) : (
                                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">Reminder {index + 2}</Badge>
                                    )}
                                  </td>
                                  <td className="py-3 px-4 text-gray-300">{reminder.message}</td>
                                </tr>
                              ))}

                              {/* File Uploads */}
                              {approvalHistory[job.id]?.fileUploads?.map((fileUpload, index) => (
                                <tr key={`file-${index}`} className="bg-gray-900 border-b border-gray-800">
                                  <td className="py-3 px-4 text-gray-300">
                                    {new Date(fileUpload.date).toLocaleDateString()} at {new Date(fileUpload.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                  </td>
                                  <td className="py-3 px-4 text-gray-300">Files Uploaded</td>
                                  <td className="py-3 px-4">
                                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Files</Badge>
                                  </td>
                                  <td className="py-3 px-4 text-gray-300">
                                    <div className="flex items-center justify-between">
                                      <span>{fileUpload.filename}</span>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-blue-400 hover:text-blue-300 p-0 h-auto"
                                        onClick={() => {
                                          setSelectedFile({ filename: fileUpload.filename, date: fileUpload.date });
                                          setFilePreviewDialogOpen(true);
                                        }}
                                      >
                                        <Eye className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}

                              {/* Current Status Summary - Moved below table */}
                              <tr className="bg-gray-800 border-b border-gray-700">
                                <td className="py-3 px-4 text-gray-300">Current</td>
                                <td className="py-3 px-4 text-gray-300">Awaiting Owner Response</td>
                                <td className="py-3 px-4">
                                  <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30 text-xs">Pending</Badge>
                                </td>
                                <td className="py-3 px-4 text-gray-300">Last reminder sent 1 day ago</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Current Status Summary - Moved below table */}
                    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        {approvalHistory[job.id]?.status === 'approved' ? (
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        ) : job.cost && job.cost >= 1000 ? (
                          <AlertCircle className="h-5 w-5 text-red-400" />
                        ) : (
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        )}
                        <div>
                          <div className="text-sm font-medium text-white">
                            {approvalHistory[job.id]?.status === 'approved' ? 'Approved by Owner' : 
                             job.cost && job.cost >= 1000 ? 'Pre-approval' : 'Automatically Approved'}
                          </div>
                          <div className="text-xs text-gray-400">
                            {approvalHistory[job.id]?.status === 'approved' ? 
                             `Approved on ${new Date(approvalHistory[job.id].date).toLocaleDateString()}` :
                             job.cost && job.cost >= 1000 
                              ? `Jobs over $1,000 require owner approval` 
                              : `Jobs under $1,000 are automatically approved`
                            }
                          </div>
                        </div>
                      </div>
                      <Badge className={
                        approvalHistory[job.id]?.status === 'approved' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                        job.cost && job.cost >= 1000 
                          ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                          : 'bg-green-500/20 text-green-400 border-green-500/30'
                      }>
                        {approvalHistory[job.id]?.status === 'approved' ? 'Approved' :
                         job.cost && job.cost >= 1000 ? 'Pending' : 'Approved'}
                      </Badge>
                    </div>

                    {/* Approval Actions */}
                    {job.cost && job.cost >= 1000 && (
                      <div className="space-y-3 pt-4 border-t border-gray-700">
                        <Label className="text-gray-300 text-sm font-medium">Approval Actions</Label>
                        
                        {/* Send Reminder Button */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <label 
                              className="cursor-pointer flex items-center gap-2 p-3 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors flex-1"
                              onClick={() => {
                                setReminderCount(prev => prev + 1);
                                const newReminder = {
                                  type: 'followup',
                                  date: new Date().toISOString(),
                                  message: `Follow-up reminder ${reminderCount + 1} sent to owner`
                                };
                                setApprovalHistory(prev => ({
                                  ...prev,
                                  [job.id]: {
                                    ...prev[job.id],
                                    reminders: [...(prev[job.id]?.reminders || []), newReminder]
                                  }
                                }));
                                alert('Follow-up email sent to owner');
                              }}
                            >
                              <MessageSquare className="h-4 w-4 text-blue-400" />
                              <span className="text-sm text-gray-300">Send reminder</span>
                            </label>
                          </div>
                        </div>
                        
                        {/* Evidence Upload */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <label className="cursor-pointer flex items-center gap-2 p-3 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors flex-1">
                              <input
                                type="file"
                                accept="image/*,application/pdf"
                                className="hidden"
                                onChange={e => {
                                  const file = e.target.files?.[0] || null;
                                  if (file) {
                                    // Immediately add the file upload to the approval history as a table row
                                    const newFileUpload = {
                                      date: new Date().toISOString(),
                                      filename: file.name
                                    };
                                    setApprovalHistory(prev => ({
                                      ...prev,
                                      [job.id]: {
                                        ...prev[job.id],
                                        fileUploads: [...(prev[job.id]?.fileUploads || []), newFileUpload]
                                      }
                                    }));
                                    alert('Files uploaded successfully');
                                  }
                                }}
                              />
                              <Paperclip className="h-4 w-4 text-blue-400" />
                              <span className="text-sm text-gray-300">Upload files</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeTab === 'details' && (
                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <span>Activities</span>
                      <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => setNewActivityDialogOpen(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Activity
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="bg-gray-800 border-b border-gray-700">
                            <th className="text-left py-3 px-4 font-semibold text-white">Property</th>
                            <th className="text-left py-3 px-4 font-semibold text-white">Work Order</th>
                            <th className="text-left py-3 px-4 font-semibold text-white">Activity</th>
                            <th className="text-left py-3 px-4 font-semibold text-white">Owner</th>
                            <th className="text-left py-3 px-4 font-semibold text-white">Date</th>
                            <th className="text-left py-3 px-4 font-semibold text-white">Files</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            // Add Work Order Update milestone to the activities
                            const workStartedIndex = activityMilestones.findIndex(m => m.milestone === 'Work Started');
                            let activitiesWithUpdate = [];
                            if (workStartedIndex !== -1) {
                              activitiesWithUpdate = [
                                ...activityMilestones.slice(0, workStartedIndex + 1),
                                { milestone: 'Work Order Update', owner: 'PM', description: 'General update to work order', responsibility: 'Any update or note related to the work order' },
                                ...activityMilestones.slice(workStartedIndex + 1)
                              ];
                            } else {
                              activitiesWithUpdate = [
                                ...activityMilestones,
                                { milestone: 'Work Order Update', owner: 'PM', description: 'General update to work order', responsibility: 'Any update or note related to the work order' }
                              ];
                            }
                            
                            return activitiesWithUpdate.map(milestone => ({
                              ...milestone,
                              job,
                              date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                            }))
                            .map((row, i) => (
                              <tr key={row.milestone + i} className="bg-gray-900 border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                                <td className="py-3 px-4 text-gray-300">{row.job.property}</td>
                                <td className="py-3 px-4 text-gray-300">{row.job.description}</td>
                                <td className="py-3 px-4 text-gray-300">{row.milestone}</td>
                                <td className="py-3 px-4 text-gray-300">
                                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${
                                    row.owner === 'PM' ? 'bg-blue-700 text-blue-100' :
                                    row.owner === 'Technician' ? 'bg-green-700 text-green-100' :
                                    'bg-purple-700 text-purple-100'
                                  }`}>
                                    {row.owner}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-gray-300">{row.date}</td>
                                <td className="py-3 px-4 text-gray-300">
                                  {/* Mock file for demonstration - in real app this would come from activity data */}
                                  {row.milestone === 'Work Order Update' && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="text-blue-400 hover:text-blue-300 p-0 h-auto"
                                      onClick={() => {
                                        setSelectedFile({ 
                                          filename: 'activity_document.pdf', 
                                          date: row.date 
                                        });
                                        setFilePreviewDialogOpen(true);
                                      }}
                                    >
                                      <Eye className="h-3 w-3" />
                                    </Button>
                                  )}
                                </td>
                              </tr>
                            ));
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'expenses' && (
                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-white">Expenses</CardTitle>
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setNewExpenseDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Expense
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="bg-gray-800 border-b border-gray-700">
                            <th className="text-left py-3 px-4 font-semibold text-white">Date</th>
                            <th className="text-left py-3 px-4 font-semibold text-white">Merchant</th>
                            <th className="text-left py-3 px-4 font-semibold text-white">Amount</th>
                            <th className="text-left py-3 px-4 font-semibold text-white">Made By</th>
                            <th className="text-left py-3 px-4 font-semibold text-white">Billable</th>
                            <th className="text-left py-3 px-4 font-semibold text-white">Memo</th>
                            <th className="text-left py-3 px-4 font-semibold text-white">Receipt</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            const workOrderExpenses = workOrderTransactions.filter(txn => txn.jobId === job.id);
                            if (workOrderExpenses.length === 0) {
                              return (
                                <tr>
                                  <td colSpan={7} className="py-8 text-center text-gray-400">
                                    <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                                    <p>No expenses recorded for this work order yet.</p>
                                  </td>
                                </tr>
                              );
                            }
                            return workOrderExpenses.map((txn) => (
                              <tr key={txn.id} className="bg-gray-900 border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                                <td className="py-3 px-4 text-gray-300">{txn.date}</td>
                                <td className="py-3 px-4 text-gray-300">{txn.vendor}</td>
                                <td className="py-3 px-4 text-gray-300">${txn.amount.toFixed(2)}</td>
                                <td className="py-3 px-4 text-gray-300">{txn.madeBy}</td>
                                <td className="py-3 px-4 text-gray-300">
                                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${txn.billable ? 'bg-green-700 text-green-100' : 'bg-gray-700 text-gray-200'}`}>
                                    {txn.billable ? 'Billable' : 'Non-Billable'}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-gray-300">{txn.memo || '-'}</td>
                                <td className="py-3 px-4 text-gray-300">
                                  {txn.receipt ? (
                                    <div className="flex items-center gap-2">
                                      <FileText className="h-4 w-4 text-blue-400" />
                                      <span className="text-sm">{txn.receipt}</span>
                                    </div>
                                  ) : '-'}
                                </td>
                              </tr>
                            ));
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'notes' && (
                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Notes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Add Note Section */}
                    <div className="space-y-3">
                      <Label className="text-gray-300 text-sm font-medium">Add Personal Note</Label>
                      <Textarea
                        value={newNote}
                        onChange={e => setNewNote(e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white resize-none"
                        placeholder="Add your personal notes about this work order..."
                        rows={4}
                      />
                      <div className="flex justify-end">
                        <Button 
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={!newNote.trim()}
                          onClick={() => {
                            if (newNote.trim()) {
                              addNote(newNote);
                              setNewNote("");
                            }
                          }}
                        >
                          <StickyNote className="h-4 w-4 mr-2" />
                          Save Note
                        </Button>
                      </div>
                    </div>

                    {/* Existing Notes */}
                    <div className="space-y-3">
                      <Label className="text-gray-300 text-sm font-medium">Your Notes</Label>
                      {(localJobNotes[job.id] || []).length === 0 ? (
                        <div className="text-center text-gray-400 py-8 bg-gray-800 rounded-lg">
                          <StickyNote className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                          <p>No personal notes yet.</p>
                          <p className="text-sm">Add notes to track important details about this work order.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {(localJobNotes[job.id] || []).map((note, idx) => (
                            <div key={idx} className="p-4 bg-gray-800 rounded-lg border-l-4 border-blue-500">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                                    <span className="text-white text-xs font-semibold">PM</span>
                                  </div>
                                  <span className="text-sm text-gray-300 font-medium">Property Manager</span>
                                </div>
                                <span className="text-xs text-gray-400">
                                  {new Date(note.timestamp).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-200">{note.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'photos' && (
                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-white">Photos</CardTitle>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700" 
                      onClick={() => setUploadPhotoDialogOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Upload Photo
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {photos.length === 0 ? (
                      <div className="text-center py-8">
                        <Eye className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400 mb-4">No photos uploaded yet</p>
                        <p className="text-sm text-gray-500">Upload photos of the finished work or progress</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {photos.map((photo) => (
                          <div 
                            key={photo.id} 
                            className="relative group cursor-pointer"
                            onClick={() => {
                              setSelectedPhoto(photo);
                              setPhotoPreviewDialogOpen(true);
                            }}
                          >
                            <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-blue-500 transition-colors">
                              <img 
                                src={photo.url} 
                                alt={photo.filename}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-end">
                                <div className="p-2 w-full bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                  <p className="text-white text-xs truncate">{photo.filename}</p>
                                  <p className="text-gray-300 text-xs">{photo.uploadedBy}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notes Dialog */}
      <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
            <DialogDescription className="text-gray-400">
              Add a note or comment to this work order
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Note</Label>
              <Textarea
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="Enter your note..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNotesDialogOpen(false)} className="border-gray-600 text-gray-300">
              Cancel
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!newNote.trim()}
              onClick={() => {
                // Add note logic here
                setNotesDialogOpen(false);
                setNewNote("");
              }}
            >
              Add Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* File Preview Dialog */}
      <Dialog open={filePreviewDialogOpen} onOpenChange={setFilePreviewDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-400" />
              File Preview
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {selectedFile && (
                <div className="space-y-2">
                  <p><strong>Filename:</strong> {selectedFile.filename}</p>
                  <p><strong>Uploaded:</strong> {new Date(selectedFile.date).toLocaleString()}</p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedFile && (
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-300 mb-4">
                  {selectedFile.filename.endsWith('.pdf') ? 'PDF Document' : 
                   selectedFile.filename.match(/\.(jpg|jpeg|png|gif)$/i) ? 'Image File' : 
                   'Document File'}
                </p>
                <div className="flex justify-center gap-2">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" className="border-gray-600 text-gray-300">
                    <Eye className="h-4 w-4 mr-2" />
                    Open in New Tab
                  </Button>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFilePreviewDialogOpen(false)} className="border-gray-600 text-gray-300">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Activity Dialog */}
      <Dialog open={newActivityDialogOpen} onOpenChange={setNewActivityDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Activity</DialogTitle>
            <DialogDescription className="text-gray-400">
              Add a new activity to this work order
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300 text-sm font-medium">Activity Type</Label>
              <Select value={selectedActivity} onValueChange={setSelectedActivity}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Select activity type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700 text-white">
                  {availableActivities.map((activity) => (
                    <SelectItem key={activity} value={activity} className="bg-gray-900 text-white">
                      {activity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-gray-300 text-sm font-medium">Upload File (Optional)</Label>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer flex items-center gap-2 p-3 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors flex-1">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0] || null;
                      setActivityFile(file);
                    }}
                  />
                  <Paperclip className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-gray-300">Choose file</span>
                </label>
              </div>
              
              {activityFile && (
                <div className="flex items-center gap-2 p-2 bg-green-900/20 border border-green-500/30 rounded-lg mt-2">
                  <FileText className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-green-300 flex-1">{activityFile.name}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-400 hover:text-red-300"
                    onClick={() => setActivityFile(null)}
                  >
                    <XCircle className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewActivityDialogOpen(false)} className="border-gray-600 text-gray-300">
              Cancel
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!selectedActivity}
              onClick={() => {
                if (selectedActivity) {
                  // Here you would add the activity to the work order
                  // For now, just close the dialog
                  const fileInfo = activityFile ? ` with file: ${activityFile.name}` : '';
                  alert(`Activity "${selectedActivity}"${fileInfo} added successfully!`);
                  setNewActivityDialogOpen(false);
                  setSelectedActivity("");
                  setActivityFile(null);
                }
              }}
            >
              Add Activity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Expense Dialog */}
      <Dialog open={newExpenseDialogOpen} onOpenChange={setNewExpenseDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter the details for the new expense.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Merchant</Label>
              <Input className="bg-gray-800 border-gray-600 text-white" value={expenseForm.vendor} onChange={e => setExpenseForm(f => ({ ...f, vendor: e.target.value }))} placeholder="Merchant name" />
            </div>
            <div>
              <Label className="text-gray-300">Amount</Label>
              <Input className="bg-gray-800 border-gray-600 text-white" type="number" value={expenseForm.amount} onChange={e => setExpenseForm(f => ({ ...f, amount: e.target.value }))} placeholder="Amount" />
            </div>
            <div>
              <Label className="text-gray-300">Made By</Label>
              <Input className="bg-gray-800 border-gray-600 text-white" value={expenseForm.madeBy} onChange={e => setExpenseForm(f => ({ ...f, madeBy: e.target.value }))} placeholder="Name" />
            </div>
            <div>
              <Label className="text-gray-300">Billable</Label>
              <Select value={expenseForm.billable ? 'yes' : 'no'} onValueChange={v => setExpenseForm(f => ({ ...f, billable: v === 'yes' }))}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700 text-white">
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-300">Memo</Label>
              <Input className="bg-gray-800 border-gray-600 text-white" value={expenseForm.memo} onChange={e => setExpenseForm(f => ({ ...f, memo: e.target.value }))} placeholder="Memo" />
            </div>
            <div>
              <Label className="text-gray-300">Receipt</Label>
              <Input className="bg-gray-800 border-gray-600 text-white" type="file" onChange={e => setExpenseForm(f => ({ ...f, receipt: e.target.files?.[0]?.name || '' }))} />
              {expenseForm.receipt && <span className="text-xs text-green-400">{expenseForm.receipt}</span>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewExpenseDialogOpen(false)} className="border-gray-600 text-gray-300">
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" disabled={!expenseForm.vendor || !expenseForm.amount || !expenseForm.madeBy} onClick={() => {
              // Add expense logic here
              setNewExpenseDialogOpen(false);
              setExpenseForm({ vendor: '', amount: '', madeBy: '', billable: true, memo: '', receipt: '' });
            }}>
              Add Expense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Photo Dialog */}
      <Dialog open={uploadPhotoDialogOpen} onOpenChange={setUploadPhotoDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Photo</DialogTitle>
            <DialogDescription className="text-gray-400">
              Upload a photo of the finished work or progress
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Photo</Label>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer flex items-center gap-2 p-3 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // In a real app, you would upload the file to your server
                        // For demo purposes, we'll create a mock URL
                        const mockUrl = URL.createObjectURL(file);
                        const newPhoto = {
                          id: `photo-${Date.now()}`,
                          filename: file.name,
                          uploadedBy: 'Property Manager', // This would be dynamic based on user role
                          date: new Date().toISOString(),
                          url: mockUrl
                        };
                        setPhotos(prev => [...prev, newPhoto]);
                        setUploadPhotoDialogOpen(false);
                      }
                    }}
                  />
                  <Eye className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-gray-300">Choose photo</span>
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadPhotoDialogOpen(false)} className="border-gray-600 text-gray-300">
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Photo Preview Dialog */}
      <Dialog open={photoPreviewDialogOpen} onOpenChange={setPhotoPreviewDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Photo Preview</DialogTitle>
          </DialogHeader>
          {selectedPhoto && (
            <div className="space-y-4">
              <div className="relative">
                <img 
                  src={selectedPhoto.url} 
                  alt={selectedPhoto.filename}
                  className="w-full max-h-96 object-contain rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <div><b>Filename:</b> {selectedPhoto.filename}</div>
                <div><b>Uploaded By:</b> {selectedPhoto.uploadedBy}</div>
                <div><b>Date:</b> {new Date(selectedPhoto.date).toLocaleDateString()}</div>
              </div>
              <div className="flex gap-2">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = selectedPhoto.url;
                    link.download = selectedPhoto.filename;
                    link.click();
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button 
                  variant="outline" 
                  className="border-red-600 text-red-400 hover:bg-red-600/20"
                  onClick={() => {
                    setPhotos(prev => prev.filter(p => p.id !== selectedPhoto.id));
                    setPhotoPreviewDialogOpen(false);
                    setSelectedPhoto(null);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Floating Smart Assist Button */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-4 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={() => setSmartAssistOpen(true)}
        aria-label="Open Smart Assist Chat"
      >
        <Sparkles className="h-7 w-7" />
      </button>

      {/* Smart Assist Drawer */}
      <Sheet open={smartAssistOpen} onOpenChange={setSmartAssistOpen}>
        <SheetContent side="right" className="w-full max-w-md bg-gray-900 border-l border-gray-700 p-0 flex flex-col">
          <SheetHeader className="p-6 pb-2">
            <SheetTitle className="flex items-center gap-2 text-lg font-semibold text-white">
              <Sparkles className="h-5 w-5 text-blue-400" /> Smart Assist
            </SheetTitle>
            <SheetDescription className="text-gray-400">
              Ask any question about this work order, property, or expenses!
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 bg-gray-800 rounded p-4">
            {smartAssistChat.length === 0 && (
              <div className="text-gray-400 text-sm">
                Ask any question about this work order, property, or expenses!
              </div>
            )}
            {smartAssistChat.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-lg px-4 py-2 max-w-[80%] ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-blue-200'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 p-4 border-t border-gray-700 bg-gray-900">
            <Input
              className="bg-gray-800 border-gray-600 text-white flex-1"
              placeholder="Ask a question..."
              value={smartAssistInput}
              onChange={e => setSmartAssistInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSmartAssistSend(); }}
            />
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSmartAssistSend}>
              <Send className="h-4 w-4 mr-1" /> Ask
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
} 