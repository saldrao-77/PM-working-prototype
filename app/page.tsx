"use client"

import React from "react"
import { DialogFooter } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import {
  DollarSign,
  FileText,
  Mail,
  Receipt,
  Settings,
  Eye,
  Download,
  Building,
  CheckCircle,
  AlertCircle,
  Zap,
  ExternalLink,
  FolderSyncIcon as Sync,
  Database,
  FileSpreadsheet,
  Send,
  Clock,
  MoreVertical,
  CreditCard,
  TrendingUp,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Filter,
  Search,
  User,
  Calendar,
  Folder,
  Phone,
  Home,
  Trash2,
  StickyNote,
  ChevronRight,
  Paperclip,
  Sparkles,
  DownloadCloud,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Plus,
  Pencil,
  BarChart3,
  Award,
  AlertTriangle,
  ChevronDown,
  Edit,
  BookOpen,
  Check,
  X,
  FileArchive,
  Upload,
  Grid,
  List,
  Tag,
  Bot,
  FileImage,
  FileCheck,
  FileWarning,
  Archive,
  Calendar as CalendarIcon,
  ExternalLink as LinkIcon,
  Flag
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from 'next/navigation'
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { jobsList, activityMilestones, jobNotes, activityFiles, collateralDocuments, documentTypeLabels, propertyOptions, staffOptions, DocumentType, CollateralDocument } from './mockData';

// Sample staff list
const staffList = [
  { id: 'tech1', name: 'Alice Johnson', phone: '555-111-2222', email: 'alice.johnson@email.com' },
  { id: 'tech2', name: 'Bob Martinez', phone: '555-333-4444', email: 'bob.martinez@email.com' },
  { id: 'tech3', name: 'Carlos Lee', phone: '555-555-6666', email: 'carlos.lee@email.com' },
]

// Add transactions type and data near the top with other data definitions
type Transaction = {
  id: string
  date: string
  vendor: string
  amount: number
  status: 'reconciled' | 'pending'
  billable: boolean
  jobId: string
  madeBy: string
  cardHolder?: string // Add card holder information
  memo?: string
  receipt?: string
}

// Enhanced Card Types
type CardType = 'virtual' | 'physical';
type CardStatus = 'active' | 'inactive' | 'blocked' | 'pending';

type EnhancedCard = {
  id: string;
  type: CardType;
  number: string;
  holder: string;
  position: 'PM' | 'Technician' | 'Super' | 'Admin';
  balance: number;
  limit: number;
  status: CardStatus;
  assignedProperties: string[]; // Property IDs
  vendorRestrictions: string[]; // Vendor names or categories
  isExistingCard: boolean; // For connected Amex, etc.
  brand: 'Amex' | 'Chase' | 'Visa' | 'Mastercard';
  expiryDate: string;
  lastUsed?: string;
  monthlySpend: number;
  assignedStaff: string[]; // Staff member IDs
};

// Enhanced Expense Request Types
type ExpenseRequest = {
  id: string;
  technicianName: string;
  expenseId: string;
  question: string;
  amount: number;
  vendor: string;
  date: string;
  urgency: 'low' | 'normal' | 'high';
  status: 'pending' | 'approved' | 'denied';
  type: 'billable_question' | 'approval_required' | 'policy_clarification' | 'receipt_issue' | 'amount_verification';
  createdAt: string;
  aiSuggestion: string;
  category: string;
  property?: string;
  workOrder?: string;
};

const transactionsList: Transaction[] = [
  {
    id: 'txn1',
    date: '2025-01-15',
    vendor: 'Home Depot',
    amount: 150.00,
    status: 'reconciled',
    billable: true,
    jobId: 'job1',
    madeBy: 'John Smith',
    cardHolder: 'John Smith',
    memo: 'HVAC parts',
    receipt: 'receipt1.pdf'
  },
  {
    id: 'txn2',
    date: '2025-01-16',
    vendor: 'Lowes',
    amount: 75.50,
    status: 'pending',
    billable: true,
    jobId: 'job1',
    madeBy: 'Sarah Johnson',
    cardHolder: 'Sarah Johnson',
    memo: 'Paint supplies',
    receipt: 'receipt2.pdf'
  },
  {
    id: 'txn3',
    date: '2025-01-17',
    vendor: 'Ace Hardware',
    amount: 45.25,
    status: 'reconciled',
    billable: false,
    jobId: 'job1',
    madeBy: 'Alice Johnson',
    cardHolder: 'Alice Johnson',
    memo: 'Tools',
    receipt: 'receipt3.pdf'
  },
  {
    id: 'txn4',
    date: '2025-01-18',
    vendor: 'Office Depot',
    amount: 125.75,
    status: 'pending',
    billable: true,
    jobId: 'job2',
    madeBy: 'Mike Chen',
    cardHolder: 'Mike Chen',
    memo: 'Office supplies',
    receipt: 'receipt4.pdf'
  },
  {
    id: 'txn5',
    date: '2025-01-19',
    vendor: 'Staples',
    amount: 89.99,
    status: 'reconciled',
    billable: false,
    jobId: 'job2',
    madeBy: 'Lisa Wong',
    cardHolder: 'Lisa Wong',
    memo: 'Paper and ink',
    receipt: 'receipt5.pdf'
  }
]

// Mock enhanced cards data
const enhancedCards: EnhancedCard[] = [
  {
    id: 'card1',
    type: 'virtual',
    number: '**** 4532',
    holder: 'Alice Johnson',
    position: 'Technician',
    balance: 2350,
    limit: 5000,
    status: 'active',
    assignedProperties: ['stanford', 'sunnyvale'],
    vendorRestrictions: ['Home Depot', 'Lowes', 'Ace Hardware'],
    isExistingCard: false,
    brand: 'Chase',
    expiryDate: '12/26',
    lastUsed: '2 hours ago',
    monthlySpend: 1650,
    assignedStaff: ['tech1']
  },
  {
    id: 'card2',
    type: 'physical',
    number: '**** 7891',
    holder: 'Bob Martinez',
    position: 'PM',
    balance: 1875,
    limit: 3000,
    status: 'active',
    assignedProperties: ['downtown'],
    vendorRestrictions: ['Office Depot', 'Staples', 'Amazon Business'],
    isExistingCard: true, // Connected existing Amex
    brand: 'Amex',
    expiryDate: '08/27',
    lastUsed: '1 day ago',
    monthlySpend: 1125,
    assignedStaff: ['tech2']
  },
  {
    id: 'card3',
    type: 'virtual',
    number: '**** 2468',
    holder: 'Carlos Lee',
    position: 'Super',
    balance: 4200,
    limit: 7500,
    status: 'active',
    assignedProperties: ['highland', 'westside'],
    vendorRestrictions: ['Home Depot', 'Lowes', 'Sherwin Williams', 'Benjamin Moore'],
    isExistingCard: false,
    brand: 'Visa',
    expiryDate: '03/28',
    lastUsed: '3 hours ago',
    monthlySpend: 2850,
    assignedStaff: ['tech3']
  },
  {
    id: 'card4',
    type: 'physical',
    number: '**** 9876',
    holder: 'Diana Smith',
    position: 'Admin',
    balance: 1200,
    limit: 2500,
    status: 'active',
    assignedProperties: ['stanford', 'downtown'],
    vendorRestrictions: ['Office Depot', 'Staples', 'Amazon Business', 'Fedex'],
    isExistingCard: true, // Connected existing Mastercard
    brand: 'Mastercard',
    expiryDate: '11/26',
    lastUsed: '4 days ago',
    monthlySpend: 890,
    assignedStaff: ['admin1']
  },
  {
    id: 'card5',
    type: 'virtual',
    number: '**** 5432',
    holder: 'Mike Thompson',
    position: 'Technician',
    balance: 3100,
    limit: 4000,
    status: 'active',
    assignedProperties: ['highland'],
    vendorRestrictions: ['Home Depot', 'Lowes', 'Benjamin Moore', 'Sherwin Williams'],
    isExistingCard: false,
    brand: 'Chase',
    expiryDate: '09/27',
    lastUsed: '1 hour ago',
    monthlySpend: 2200,
    assignedStaff: ['tech4']
  },
  {
    id: 'card6',
    type: 'physical',
    number: '**** 1357',
    holder: 'Sarah Wilson',
    position: 'PM',
    balance: 2800,
    limit: 6000,
    status: 'active',
    assignedProperties: ['westside', 'sunnyvale'],
    vendorRestrictions: ['Office Depot', 'Home Depot', 'Amazon Business', 'Lowes'],
    isExistingCard: true, // Connected existing Visa
    brand: 'Visa',
    expiryDate: '05/28',
    lastUsed: '6 hours ago',
    monthlySpend: 1950,
    assignedStaff: ['pm2']
  }
];

// Mock comprehensive expense requests data
const mockExpenseRequests: ExpenseRequest[] = [
  {
    id: 'req1',
    technicianName: 'Alice Johnson',
    expenseId: 'txn1',
    question: 'Is emergency plumbing repair billable to owner?',
    amount: 450,
    vendor: 'Quick Fix Plumbing',
    date: '2024-01-20',
    urgency: 'high',
    status: 'pending',
    type: 'billable_question',
    createdAt: '2024-01-20T09:00:00',
    aiSuggestion: 'Yes - Emergency repairs are typically billable to owner when related to property maintenance. Recommend approval with receipt requirement.',
    category: 'Emergency Repair',
    property: 'Stanford GSB',
    workOrder: 'job1'
  },
  {
    id: 'req2',
    technicianName: 'Bob Martinez',
    expenseId: 'txn3',
    question: 'Do I need pre-approval for $750 office supplies?',
    amount: 750,
    vendor: 'Office Depot',
    date: '2024-01-19',
    urgency: 'normal',
    status: 'pending',
    type: 'approval_required',
    createdAt: '2024-01-19T14:30:00',
    aiSuggestion: 'Yes - Expenses over $500 require pre-approval per company policy. Request should include itemized list and business justification.',
    category: 'Office Supplies',
    property: 'Downtown Lofts'
  },
  {
    id: 'req3',
    technicianName: 'Diana Roberts',
    expenseId: 'txn8',
    question: 'Can I expense gas for emergency call-out?',
    amount: 35,
    vendor: 'Shell Gas Station',
    date: '2024-01-18',
    urgency: 'low',
    status: 'approved',
    type: 'policy_clarification',
    createdAt: '2024-01-18T16:45:00',
    aiSuggestion: 'Yes - Vehicle expenses for emergency work orders are reimbursable. Ensure receipt shows business purpose.',
    category: 'Vehicle Expenses',
    property: 'Sunnyvale 432'
  },
  {
    id: 'req4',
    technicianName: 'Mark Thompson',
    expenseId: 'txn9',
    question: 'Receipt is damaged - can I submit alternative proof?',
    amount: 125,
    vendor: 'Home Depot',
    date: '2024-01-17',
    urgency: 'normal',
    status: 'pending',
    type: 'receipt_issue',
    createdAt: '2024-01-17T11:20:00',
    aiSuggestion: 'Bank/credit card statement can serve as backup. Contact vendor for duplicate receipt or submit detailed purchase description.',
    category: 'Documentation Issue',
    property: 'Highland Park'
  },
  {
    id: 'req5',
    technicianName: 'Sarah Kim',
    expenseId: 'txn10',
    question: 'Is $1,200 HVAC part cost reasonable?',
    amount: 1200,
    vendor: 'HVAC Supply Co',
    date: '2024-01-16',
    urgency: 'high',
    status: 'pending',
    type: 'amount_verification',
    createdAt: '2024-01-16T08:15:00',
    aiSuggestion: 'Request additional quotes for comparison. HVAC parts can vary significantly - verify part number and necessity with property manager.',
    category: 'HVAC Maintenance',
    property: 'Stanford GSB',
    workOrder: 'job4'
  },
  {
    id: 'req6',
    technicianName: 'Carlos Lee',
    expenseId: 'txn11',
    question: 'Should paint supplies be billable or operational?',
    amount: 280,
    vendor: 'Sherwin Williams',
    date: '2024-01-15',
    urgency: 'normal',
    status: 'denied',
    type: 'billable_question',
    createdAt: '2024-01-15T13:45:00',
    aiSuggestion: 'Routine maintenance painting is typically operational. Unit-specific repairs would be billable. Need more context on scope.',
    category: 'Maintenance',
    property: 'Westside Complex'
  },
  {
    id: 'req7',
    technicianName: 'Lisa Chang',
    expenseId: 'txn12',
    question: 'Can I expense overnight tools for urgent repair?',
    amount: 95,
    vendor: 'Amazon',
    date: '2024-01-14',
    urgency: 'high',
    status: 'approved',
    type: 'policy_clarification',
    createdAt: '2024-01-14T19:30:00',
    aiSuggestion: 'Emergency tool purchases are acceptable for urgent repairs. Ensure tools remain company property and document necessity.',
    category: 'Tools & Equipment',
    property: 'Downtown Lofts'
  },
  {
    id: 'req8',
    technicianName: 'Mike Rodriguez',
    expenseId: 'txn13',
    question: 'Multiple small receipts - combine or separate submissions?',
    amount: 180,
    vendor: 'Various',
    date: '2024-01-13',
    urgency: 'low',
    status: 'pending',
    type: 'policy_clarification',
    createdAt: '2024-01-13T10:00:00',
    aiSuggestion: 'Combine related purchases by work order. Submit separately if different properties or categories. Include clear itemization.',
    category: 'Process Question',
    property: 'Multiple Properties'
  }
];

// Add type for milestone ownership
type MilestoneOwner = 'PM' | 'Technician' | 'Central Office';

// Remove the local activityMilestones array definition (lines 113-152)
// The activityMilestones is now imported from './mockData'

// Add 'Work Order Update' after 'Work Started' in activityMilestones
const workStartedIndex = activityMilestones.findIndex(m => m.milestone === 'Work Started');
let activityMilestonesWithUpdate: typeof activityMilestones = [];
if (workStartedIndex !== -1) {
  activityMilestonesWithUpdate = [
    ...activityMilestones.slice(0, workStartedIndex + 1),
    { milestone: 'Work Order Update', owner: 'PM' as MilestoneOwner, description: 'General update to work order', responsibility: 'Any update or note related to the work order' },
    ...activityMilestones.slice(workStartedIndex + 1)
  ];
} else {
  activityMilestonesWithUpdate = [
    ...activityMilestones,
    { milestone: 'Work Order Update', owner: 'PM' as MilestoneOwner, description: 'General update to work order', responsibility: 'Any update or note related to the work order' }
  ];
}

export default function PMFinancialDashboard() {
  const [expandedProperty, setExpandedProperty] = useState<string | null>(null)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [reportDialogOpen, setReportDialogOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<any>(null)
  const [newMessage, setNewMessage] = useState("")
  const [selectedThread, setSelectedThread] = useState<string | null>(null)
  const [approvalFilter, setApprovalFilter] = useState("all")
  const [approvalSearch, setApprovalSearch] = useState("")
  const [selectedApproval, setSelectedApproval] = useState<any>(null)
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [newJobDialogOpen, setNewJobDialogOpen] = useState(false)
  const [newPropertyDialogOpen, setNewPropertyDialogOpen] = useState(false)
  const [importAppFolioDialogOpen, setImportAppFolioDialogOpen] = useState(false)
  const [jobViewDialogOpen, setJobViewDialogOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<typeof jobsList[0] | null>(null)
  const [jobs, setJobs] = useState(jobsList)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [jobToDelete, setJobToDelete] = useState<typeof jobsList[0] | null>(null)
  const [editJobDialogOpen, setEditJobDialogOpen] = useState(false)
  const [editJob, setEditJob] = useState<typeof jobsList[0] | null>(null)
  const [staff, setStaff] = useState(staffList)
  const [newStaffDialogOpen, setNewStaffDialogOpen] = useState(false)
  const [editStaffDialogOpen, setEditStaffDialogOpen] = useState(false)
  const [viewStaffJobsDialogOpen, setViewStaffJobsDialogOpen] = useState(false)
  const [viewStaff, setViewStaff] = useState<{ id: string; name: string; phone: string } | null>(null)
  const [editStaff, setEditStaff] = useState<{ id: string; name: string; phone: string } | null>(null)
  const [newStaffName, setNewStaffName] = useState("")
  const [newStaffPhone, setNewStaffPhone] = useState("")
  const [editStaffName, setEditStaffName] = useState("")
  const [editStaffPhone, setEditStaffPhone] = useState("")
  const [expandedStaffId, setExpandedStaffId] = useState<string | null>(null)
  const [walletBillable, setWalletBillable] = useState<{ [key: number]: boolean }>({})
  const [newJobCost, setNewJobCost] = useState(0)
  const [newJobPreApproval, setNewJobPreApproval] = useState<'Required' | 'Not Required'>('Not Required')
  const [approvalJobs, setApprovalJobs] = useState<{ [id: string]: { sentAt: string, status: string, note?: string } }>({})
  // State for pre-approval workflow
  const [showPreApprovalDialog, setShowPreApprovalDialog] = useState(false);
  const [showSendEmailDialog, setShowSendEmailDialog] = useState(false);
  const [pendingJob, setPendingJob] = useState<any>(null);
  // Update role state to include 'owner'
  const [role, setRole] = useState<'pm' | 'technician' | 'centralOffice' | 'owner'>('pm');
  // For demo, use Alice Johnson as the logged-in technician
  const technicianName = 'Alice Johnson';
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [notesJob, setNotesJob] = useState<any>(null);
  const [newNote, setNewNote] = useState("");
  // Store notes per job (mock for now, can be persisted)
  const [jobNotes, setJobNotes] = useState<{ [jobId: string]: { author: string, content: string, timestamp: string }[] }>({});
  const [pendingAssignments, setPendingAssignments] = useState<{ [txnId: string]: string } | null>(null);
  // Add state for selected job transactions
  const [selectedJobForTransactions, setSelectedJobForTransactions] = useState<typeof jobsList[0] | null>(null);
  // Add state for selected transaction details
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  // Add state for expanded job expenses
  const [expandedJobExpenses, setExpandedJobExpenses] = useState<string | null>(null);
  // Add state for expanded property employees
  const [expandedPropertyEmployees, setExpandedPropertyEmployees] = useState<string | null>(null);
  // Add state for Expenses tab filters
  const [expensesJobFilter, setExpensesJobFilter] = useState<string>('not_assigned');
  const [expensesPropertyFilter, setExpensesPropertyFilter] = useState<string>('not_assigned');
  // Add state for transaction assignments in Expenses tab
  const [txnAssignments, setTxnAssignments] = useState<{ [txnId: string]: { property?: string; job?: string } }>({});
  // Add state for memo and receipt uploads in Expenses tab
  const [txnMemos, setTxnMemos] = useState<{ [txnId: string]: string }>({});
  const [txnReceipts, setTxnReceipts] = useState<{ [txnId: string]: File | null }>({});
  // Add state for Activity tab filters
  const [activityPropertyFilter, setActivityPropertyFilter] = useState<string>('all');
  const [activityJobFilter, setActivityJobFilter] = useState<string>('all');
  const [activityMilestoneFilter, setActivityMilestoneFilter] = useState<string>('all');
  const [activityOwnerFilter, setActivityOwnerFilter] = useState<string>('all');
  // Add state for new activity row in Activity tab
  const [newActivity, setNewActivity] = useState<any | null>(null);
  // Add state for uploaded files in Activity tab
  const [activityFiles, setActivityFiles] = useState<{ [key: string]: File[] }>({});
  // State for Smart Assist chat
  const [smartAssistInput, setSmartAssistInput] = useState("");
  const [smartAssistChat, setSmartAssistChat] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  // State for Transactions tab filters
  const [txnFilterStatus, setTxnFilterStatus] = useState<string>('all');
  const [txnFilterBillable, setTxnFilterBillable] = useState<string>('all');
  const [txnFilterProperty, setTxnFilterProperty] = useState<string>('all');
  const [txnFilterJob, setTxnFilterJob] = useState<string>('all');
  const [txnFilterDateFrom, setTxnFilterDateFrom] = useState<string>('');
  const [txnFilterDateTo, setTxnFilterDateTo] = useState<string>('');
  const [txnFilterMadeBy, setTxnFilterMadeBy] = useState<string>('all');
  // State for job timeline modal
  const [timelineJob, setTimelineJob] = useState<typeof jobsList[0] | null>(null);
  const [timelineOpen, setTimelineOpen] = useState(false);
  // State for new work order form
  const [newWorkOrder, setNewWorkOrder] = useState({
    property: '',
    description: '',
    
    notes: '',
    cost: '',
    priority: 'Medium'
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  // Add state for new activity dialog
  const [newActivityDialogOpen, setNewActivityDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState("");
  const [activityFile, setActivityFile] = useState<File | null>(null);
  
  // Add state for new expense dialog
  const [newExpenseDialogOpen, setNewExpenseDialogOpen] = useState(false);
  
  // Add state for main expense form (for adding new expenses)
  const [mainExpenseForm, setMainExpenseForm] = useState({
    vendor: '',
    amount: '',
    madeBy: '',
    billable: true,
    memo: '',
    receipt: ''
  });
  
  // Add state for editing expense in form
  const [editingExpense, setEditingExpense] = useState<Transaction | null>(null);
  const [expenseForm, setExpenseForm] = useState({
    property: '',
    job: '',
    billable: true,
    memo: '',
    receipt: '' // store as string
  });
  
  // Add state for edit job form
  const [editJobForm, setEditJobForm] = useState({
    property: '',
    description: '',
    cost: '',
    priority: 'Medium'
  });
  
  // Add state for transactions
  const [transactions, setTransactions] = useState<Transaction[]>(transactionsList);

  // Add state for inline editing of uncategorized expenses
  const [inlineEditingExpense, setInlineEditingExpense] = useState<string | null>(null);
  const [inlineExpenseForm, setInlineExpenseForm] = useState({
    property: '',
    job: '',
    billable: true,
    memo: '',
    receipt: '' // store as string
  });

  // Add state for new transaction form (Central Office)
  const [newTransactionDialogOpen, setNewTransactionDialogOpen] = useState(false);
  const [newTransactionForm, setNewTransactionForm] = useState({
    date: '',
    vendor: '',
    amount: '',
    madeBy: '',
    cardHolder: '',
    property: '',
    job: '',
    billable: true,
    memo: '',
    receipt: ''
  });

  // Add state for transaction review flags
  const [transactionReviewFlags, setTransactionReviewFlags] = useState<{ [txnId: string]: string }>({
    'txn1': 'Missing receipt',
    'txn3': 'Wrong property',
    'txn5': 'Unusual amount',
    'txn7': 'Missing memo'
  });

  // Add state for toggling review table visibility
  const [reviewTableExpanded, setReviewTableExpanded] = useState(false);

  // Add state for editing transactions (Central Office)
  const [editTransactionDialogOpen, setEditTransactionDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editTransactionForm, setEditTransactionForm] = useState({
    date: '',
    vendor: '',
    amount: '',
    madeBy: '',
    cardHolder: '',
    property: '',
    job: '',
    billable: true,
    memo: '',
    receipt: ''
  });

  // Card dialog states
  const [issueCardDialogOpen, setIssueCardDialogOpen] = useState(false);
  const [connectCardDialogOpen, setConnectCardDialogOpen] = useState(false);
  const [cardForm, setCardForm] = useState({
    type: 'virtual' as CardType,
    holder: '',
    position: 'Technician' as EnhancedCard['position'],
    limit: '',
    assignedProperties: [] as string[],
    vendorRestrictions: [] as string[],
    isExistingCard: false,
    brand: 'Chase' as EnhancedCard['brand'],
    assignedStaff: [] as string[]
  });

  // Expense Requests state
  const [expenseRequests, setExpenseRequests] = useState<ExpenseRequest[]>(mockExpenseRequests);
  const [expensePolicyDialogOpen, setExpensePolicyDialogOpen] = useState(false);
  const [policyRules, setPolicyRules] = useState([
    {
      id: 1,
      category: 'Emergency Repairs',
      rule: 'Emergency repairs over $300 are automatically billable to owner',
      aiEnabled: true,
      active: true
    },
    {
      id: 2,
      category: 'Pre-approval',
      rule: 'Expenses over $500 require pre-approval',
      aiEnabled: true,
      active: true
    },
    {
      id: 3,
      category: 'Receipt Requirements',
      rule: 'All expenses over $25 require receipt within 48 hours',
      aiEnabled: true,
      active: true
    },
    {
      id: 4,
      category: 'Vehicle Expenses',
      rule: 'Mileage and gas for emergency calls are reimbursable',
      aiEnabled: true,
      active: true
    }
  ]);

  // Available activities for PM to add
  const availableActivities = [
    'Work Order Received',
    'Pre-Approval Sent', 
    'Pre-Approval Received',
    'Work Order Update',
    'Work Order Closed'
  ];

  // State for enhanced reimbursement functionality
  const [reimbursementDialogOpen, setReimbursementDialogOpen] = useState(false);
  const [selectedReimbursementJob, setSelectedReimbursementJob] = useState<any>(null);
  const [reimbursementAmount, setReimbursementAmount] = useState(0);
  const [reimbursementNote, setReimbursementNote] = useState('');
  const [reimbursementMethod, setReimbursementMethod] = useState('check'); // check, wire, ach
  const [sendReportToOwner, setSendReportToOwner] = useState(true);
  const [reimbursementDate, setReimbursementDate] = useState(new Date().toISOString().split('T')[0]);
  const [ownerNotificationMethod, setOwnerNotificationMethod] = useState('email'); // email, phone, text, none
  
  // State for Policy tab
  const [aiPolicyContent, setAiPolicyContent] = useState(`# AI Expense Policy Guidelines

## General Principles
- All expenses must be reasonable and necessary for business operations
- Receipts are required for all purchases over $25
- Pre-approval required for expenses over $500
- All expenses must be properly categorized as billable or non-billable

## Billable vs Non-Billable Guidelines

### Billable Expenses
- Property-specific repairs and maintenance
- Materials and supplies for work orders
- Emergency repairs (with proper documentation)
- Property-specific tools and equipment

### Non-Billable Expenses
- General office supplies
- Personal tools and equipment
- Non-property-specific expenses
- Administrative costs

## Receipt Requirements
- All receipts must be clear and legible
- Receipts must show date, vendor, items, and total amount
- Digital receipts are acceptable
- Receipts must be uploaded within 48 hours of purchase

## Pre-Approval Process
- Expenses over $500 require pre-approval
- Emergency repairs may be approved after the fact
- All pre-approval requests must include detailed justification
- Response time: within 24 hours during business days`);

  const [policyEditMode, setPolicyEditMode] = useState(false);
  const [expenseQuestions, setExpenseQuestions] = useState<{
    id: number;
    question: string;
    answer: 'yes' | 'no' | null;
    timestamp: string | null;
    category: string;
  }[]>([
    { id: 1, question: "Is this expense reasonable and necessary?", answer: null, timestamp: null, category: "general" },
    { id: 2, question: "Should this be billable to the property/owner?", answer: null, timestamp: null, category: "billing" },
    { id: 3, question: "Is a receipt required for this purchase?", answer: null, timestamp: null, category: "documentation" },
    { id: 4, question: "Does this require pre-approval?", answer: null, timestamp: null, category: "approval" },
    { id: 5, question: "Is this an emergency repair?", answer: null, timestamp: null, category: "priority" },
    { id: 6, question: "Is this a property-specific expense?", answer: null, timestamp: null, category: "billing" },
    { id: 7, question: "Is this a recurring expense?", answer: null, timestamp: null, category: "general" },
    { id: 8, question: "Is this expense within budget?", answer: null, timestamp: null, category: "approval" }
  ]);
  const [newQuestionDialogOpen, setNewQuestionDialogOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ question: '', category: 'general' });

  // State for help request functionality
  const [helpRequestDialogOpen, setHelpRequestDialogOpen] = useState(false);
  const [helpRequestForm, setHelpRequestForm] = useState({
    expenseId: 'none',
    question: '',
    urgency: 'normal',
    additionalDetails: ''
  });
  const [helpRequests, setHelpRequests] = useState<{
    id: string;
    expenseId: string;
    technicianName: string;
    question: string;
    urgency: 'low' | 'normal' | 'high';
    additionalDetails: string;
    status: 'pending' | 'answered' | 'resolved';
    createdAt: string;
    answeredAt?: string;
    answer?: string;
  }[]>([]);

  // State for help request response dialog
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [selectedHelpRequest, setSelectedHelpRequest] = useState<any>(null);
  const [responseForm, setResponseForm] = useState({
    answer: '',
    decisionTrackerAnswers: {
      'Is this expense reasonable and necessary?': null,
      'Should this be billable to the property/owner?': null,
      'Is a receipt required?': null,
      'Does this require pre-approval?': null,
      'Is this an emergency repair?': null,
      'Is this a capital improvement?': null,
      'Should this be reimbursed?': null,
      'Is this within budget limits?': null
    }
  });

  // State for expanded work orders in payments tab
  const [expandedWorkOrders, setExpandedWorkOrders] = useState<Set<string>>(new Set());
  
  // State for monthly reports
  const [monthlyReportDialogOpen, setMonthlyReportDialogOpen] = useState(false);
  const [selectedReportProperty, setSelectedReportProperty] = useState<any>(null);
  const [reportMonth, setReportMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM format

  // Enhanced state for monthly reimbursements and trust accounts
  const [monthlyReimbursementDialogOpen, setMonthlyReimbursementDialogOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('2025-01');
  const [selectedPropertyForMonthly, setSelectedPropertyForMonthly] = useState<any>(null);
  const [ccRecipient, setCcRecipient] = useState({ name: '', email: '' });
  const [editingPolicyRule, setEditingPolicyRule] = useState<any>(null);
  const [policyRuleEditDialogOpen, setPolicyRuleEditDialogOpen] = useState(false);
  const [editedRule, setEditedRule] = useState({ category: '', rule: '', aiEnabled: false, active: false });

  // Collateral Hub state variables
  const [collateralViewMode, setCollateralViewMode] = useState<'card' | 'list'>('card');
  const [collateralSearchQuery, setCollateralSearchQuery] = useState('');
  const [collateralDebouncedSearchQuery, setCollateralDebouncedSearchQuery] = useState('');
  const [collateralIsSearching, setCollateralIsSearching] = useState(false);
  const [collateralFilterProperty, setCollateralFilterProperty] = useState('all');
  const [collateralFilterDocType, setCollateralFilterDocType] = useState('all');
  const [collateralFilterUploadedBy, setCollateralFilterUploadedBy] = useState('all');
  const [collateralFilterDateFrom, setCollateralFilterDateFrom] = useState('');
  const [collateralFilterDateTo, setCollateralFilterDateTo] = useState('');
  const [collateralUploadDialogOpen, setCollateralUploadDialogOpen] = useState(false);
  const [collateralPreviewDialogOpen, setCollateralPreviewDialogOpen] = useState(false);
  
  // AI Search State
  const [aiSearchQuery, setAiSearchQuery] = useState('');
  const [aiSearchResults, setAiSearchResults] = useState<any>(null);
  const [aiSearchLoading, setAiSearchLoading] = useState(false);
  const [aiSearchSuggestions, setAiSearchSuggestions] = useState<string[]>([]);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [askAiModalOpen, setAskAiModalOpen] = useState(false);
  const [aiChatMessages, setAiChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string, documents?: any[]}>>([]);
  const [aiChatInput, setAiChatInput] = useState('');
  const [selectedCollateralDoc, setSelectedCollateralDoc] = useState<CollateralDocument | null>(null);
  const [collateralAIAssistOpen, setCollateralAIAssistOpen] = useState(false);
  const [collateralAIQuery, setCollateralAIQuery] = useState('');
  const [collateralAIResults, setCollateralAIResults] = useState<CollateralDocument[]>([]);
  const [collateralSelectedDocs, setCollateralSelectedDocs] = useState<string[]>([]);
  const [collateralDocs, setCollateralDocs] = useState<CollateralDocument[]>(collateralDocuments);
  const [collateralUploadForm, setCollateralUploadForm] = useState({
    files: [] as File[],
    documentType: 'other' as DocumentType,
    propertyId: '',
    tags: [] as string[],
    newTag: '',
    description: '',
    linkedExpenseId: '',
    linkedJobId: '',
    linkedVendor: '',
    amount: '',
    expiryDate: ''
  });

  // Handle URL parameters for tab navigation and role detection
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    const roleParam = urlParams.get('role');
    
    // Handle tab navigation
    if (tabParam && ['dashboard', 'workorders', 'activity', 'wallet', 'transactions', 'properties', 'staff', 'payments'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
    
    // Handle role detection from URL parameters or localStorage
    if (roleParam && ['pm', 'technician', 'centralOffice'].includes(roleParam)) {
      setRole(roleParam as 'pm' | 'technician' | 'centralOffice');
      localStorage.setItem('currentRole', roleParam);
    } else {
      // Fallback to localStorage if URL param is missing
      const roleFromStorage = localStorage.getItem('currentRole');
      if (roleFromStorage && ['pm', 'technician', 'centralOffice'].includes(roleFromStorage)) {
        setRole(roleFromStorage as 'pm' | 'technician' | 'centralOffice');
      }
    }
  }, []);

  // Debounced search for CollateralHub to prevent UI freezing
  useEffect(() => {
    if (collateralSearchQuery === '') {
      // Immediately clear search if empty
      setCollateralDebouncedSearchQuery('');
      setCollateralIsSearching(false);
      return;
    }

    setCollateralIsSearching(true);
    const handler = setTimeout(() => {
      setCollateralDebouncedSearchQuery(collateralSearchQuery);
      setCollateralIsSearching(false);
    }, 500); // Increased delay to reduce filtering frequency

    return () => {
      clearTimeout(handler);
    };
  }, [collateralSearchQuery]);

  // Mock data for technicians
  const technicians = [
    { id: 'tech1', name: 'John Smith' },
    { id: 'tech2', name: 'Sarah Johnson' },
    { id: 'tech3', name: 'Mike Wilson' }
  ];

  const properties = [
    {
      id: "stanford",
      name: "Stanford GSB",
      address: "655 Knight Way, Stanford, CA",
      totalBalance: 1250.0,
      cardCount: 2,
      pendingBills: 3,
      trustBalance: 15420.5,
      lastSync: "2 hours ago",
      qboStatus: "synced",
      reconciliationStatus: "balanced",
      pendingTransactions: 5,
      lastReport: "Jan 15, 2024",
      trustAccount: {
        bankName: "Wells Fargo",
        accountNumber: "****2847",
        routingNumber: "121000248",
        accountType: "Trust Account",
        autoMapping: true,
        lastReimbursement: "2025-01-10"
      },
      ownerEmail: "owner@stanford.edu",
      ownerName: "Dr. Sarah Wilson",
      ownerPhone: "650-723-2273",
      ownerAddress: "Graduate School of Business, 655 Knight Way, Stanford, CA 94305",
      ownerPreferredContact: "email", // email, phone, text
      staff: [
        { name: "Linda Evans", role: "Receptionist", phone: "555-101-2020", email: "linda.evans@stanford.edu" },
        { name: "Mark Lee", role: "Property Manager", phone: "555-303-4040", email: "mark.lee@stanford.edu" },
        { name: "Carlos Ramirez", role: "Maintenance Technician", phone: "555-111-2222", email: "carlos.ramirez@stanford.edu" },
        { name: "Janet Kim", role: "Porter / Janitor", phone: "555-333-4444", email: "janet.kim@stanford.edu" },
        { name: "Samantha Green", role: "Leasing Agent", phone: "555-555-6666", email: "samantha.green@stanford.edu" },
        { name: "Alexis Chen", role: "Concierge / Front Desk", phone: "555-777-8888", email: "alexis.chen@stanford.edu" },
        { name: "Robert King", role: "Security Guard", phone: "555-999-0000", email: "robert.king@stanford.edu" }
      ],
      cards: [
        { id: "1", number: "**** 4532", holder: "John Smith", balance: 635.0, status: "active" },
        { id: "2", number: "**** 7891", holder: "Sarah Johnson", balance: 615.0, status: "active" },
      ],
      recentActivity: [
        { type: "expense", description: "Home Depot purchase", amount: 635.0, date: "2 hours ago" },
        { type: "payment", description: "Trust transfer", amount: 1200.0, date: "1 day ago" },
        { type: "report", description: "Monthly statement sent", amount: 0, date: "3 days ago" },
      ],
      transactions: [
        {
          id: "1",
          date: "2024-01-15",
          vendor: "Home Depot",
          amount: 635.0,
          category: "Repairs & Maintenance",
          status: "pending",
          receipt: true,
        },
        {
          id: "2",
          date: "2024-01-14",
          vendor: "Trader Joe's",
          amount: 51.91,
          category: "Office Supplies",
          status: "reconciled",
          receipt: true,
        },
      ],
    },
    {
      id: "sunnyvale",
      name: "Sunnyvale 432",
      address: "432 Sunnyvale Ave, Sunnyvale, CA",
      totalBalance: 2991.25,
      cardCount: 2,
      pendingBills: 5,
      trustBalance: 28750.75,
      lastSync: "5 minutes ago",
      qboStatus: "synced",
      reconciliationStatus: "balanced",
      pendingTransactions: 8,
      lastReport: "Jan 10, 2024",
      trustAccount: {
        bankName: "Wells Fargo",
        accountNumber: "****5923",
        routingNumber: "121000248",
        accountType: "Trust Account",
        autoMapping: true,
        lastReimbursement: "2025-01-08"
      },
      ownerEmail: "owner@sunnyvale.com", 
      ownerName: "Michael Chen",
      ownerPhone: "408-555-0123",
      ownerAddress: "432 Sunnyvale Ave, Sunnyvale, CA 94086",
      ownerPreferredContact: "phone", // email, phone, text
      staff: [
        { name: "Maria Gomez", role: "Receptionist", phone: "555-505-6060", email: "maria.gomez@sunnyvale.com" },
        { name: "James Wu", role: "Property Manager", phone: "555-707-8080", email: "james.wu@sunnyvale.com" },
        { name: "Miguel Torres", role: "Maintenance Technician", phone: "555-121-2323", email: "miguel.torres@sunnyvale.com" },
        { name: "Patricia Lee", role: "Porter / Janitor", phone: "555-343-4545", email: "patricia.lee@sunnyvale.com" },
        { name: "Emily Brown", role: "Leasing Agent", phone: "555-565-6767", email: "emily.brown@sunnyvale.com" },
        { name: "Brian Smith", role: "Concierge / Front Desk", phone: "555-787-8989", email: "brian.smith@sunnyvale.com" },
        { name: "Angela White", role: "Security Guard", phone: "555-909-1011", email: "angela.white@sunnyvale.com" }
      ],
      cards: [
        { id: "3", number: "**** 2345", holder: "Mike Chen", balance: 1200.0, status: "active" },
        { id: "4", number: "**** 6789", holder: "Lisa Wong", balance: 1791.25, status: "active" },
      ],
      recentActivity: [
        { type: "expense", description: "Lowe's purchase", amount: 289.5, date: "1 hour ago" },
        { type: "expense", description: "Office Depot", amount: 125.75, date: "6 hours ago" },
        { type: "sync", description: "QuickBooks sync", amount: 0, date: "5 minutes ago" },
      ],
      transactions: [
        {
          id: "3",
          date: "2024-01-14",
          vendor: "Lowe's",
          amount: 289.5,
          category: "Repairs & Maintenance",
          status: "pending",
          receipt: false,
        },
        {
          id: "4",
          date: "2024-01-13",
          vendor: "Office Depot",
          amount: 125.75,
          category: "Office Supplies",
          status: "reconciled",
          receipt: true,
        },
      ],
    },
    {
      id: "downtown",
      name: "Downtown Lofts",
      address: "123 Market St, San Francisco, CA",
      totalBalance: 450.0,
      cardCount: 1,
      pendingBills: 2,
      trustBalance: 12300.0,
      lastSync: "1 hour ago",
      qboStatus: "pending",
      reconciliationStatus: "variance",
      pendingTransactions: 3,
      lastReport: "Jan 8, 2024",
      trustAccount: {
        bankName: "Wells Fargo",
        accountNumber: "****7461",
        routingNumber: "121000248",
        accountType: "Trust Account",
        autoMapping: true,
        lastReimbursement: "2025-01-05"
      },
      ownerEmail: "owner@downtownlofts.com",
      ownerName: "Alex Rodriguez",
      ownerPhone: "415-555-7890",
      ownerAddress: "123 Market St, San Francisco, CA 94103",
      ownerPreferredContact: "text", // email, phone, text
      staff: [
        { name: "Sophie Tran", role: "Receptionist", phone: "555-909-1010", email: "sophie.tran@downtownlofts.com" },
        { name: "David Kim", role: "Property Manager", phone: "555-111-2121", email: "david.kim@downtownlofts.com" },
        { name: "Oscar Martinez", role: "Maintenance Technician", phone: "555-232-3434", email: "oscar.martinez@downtownlofts.com" },
        { name: "Grace Lin", role: "Porter / Janitor", phone: "555-454-5656", email: "grace.lin@downtownlofts.com" },
        { name: "Kevin Patel", role: "Leasing Agent", phone: "555-676-7878", email: "kevin.patel@downtownlofts.com" },
        { name: "Tina Brooks", role: "Concierge / Front Desk", phone: "555-898-9090", email: "tina.brooks@downtownlofts.com" },
        { name: "Victor Cruz", role: "Security Guard", phone: "555-101-1121", email: "victor.cruz@downtownlofts.com" }
      ],
      cards: [{ id: "5", number: "**** 9876", holder: "Alex Rodriguez", balance: 450.0, status: "active" }],
      recentActivity: [
        { type: "expense", description: "Ace Hardware", amount: 89.99, date: "3 hours ago" },
        { type: "alert", description: "Trust reconciliation variance", amount: 0, date: "1 day ago" },
      ],
      transactions: [
        {
          id: "5",
          date: "2024-01-12",
          vendor: "Ace Hardware",
          amount: 89.99,
          category: "Repairs & Maintenance",
          status: "pending",
          receipt: true,
        },
      ],
    },
  ]

  // Mock data for communications
  const communications = {
    messages: [
      {
        id: "1",
        propertyId: "stanford",
        senderId: "owner1",
        senderName: "John Smith",
        senderRole: "owner",
        content: "Can you approve the new HVAC maintenance request?",
        timestamp: new Date("2024-01-20T10:00:00"),
        status: "unread",
        threadId: "thread1"
      },
      {
        id: "2",
        propertyId: "stanford",
        senderId: "pm1",
        senderName: "Property Manager",
        senderRole: "pm",
        content: "I've reviewed the request. The quote seems reasonable.",
        timestamp: new Date("2024-01-20T10:30:00"),
        status: "read",
        threadId: "thread1"
      }
    ],
    approvals: [
      {
        id: "1",
        propertyId: "stanford",
        type: "maintenance",
        status: "pending",
        requestedBy: "John Smith",
        requestedAt: new Date("2024-01-20T09:00:00"),
        amount: 2500,
        description: "HVAC System Maintenance - Annual Service",
        priority: "high",
        comments: [],
        vendor: "ABC HVAC Services",
        category: "Maintenance"
      },
      {
        id: "2",
        propertyId: "sunnyvale",
        type: "expense",
        status: "pending",
        requestedBy: "Mike Chen",
        requestedAt: new Date("2024-01-20T08:30:00"),
        amount: 850,
        description: "Emergency Plumbing Repair - Kitchen Sink",
        priority: "high",
        comments: [],
        vendor: "Quick Plumb Inc",
        category: "Repairs"
      },
      {
        id: "3",
        propertyId: "downtown",
        type: "document",
        status: "approved",
        requestedBy: "Alex Rodriguez",
        requestedAt: new Date("2024-01-19T15:00:00"),
        description: "New Lease Agreement Review",
        priority: "medium",
        comments: [],
        category: "Documentation"
      }
    ]
  }

  // Mock data for property approvals
  const propertyApprovals = {
    approvals: [
      {
        id: "1",
        propertyId: "stanford",
        propertyName: "Stanford GSB",
        ownerName: "John Smith",
        ownerEmail: "owner@stanford.edu",
        type: "maintenance",
        status: "pending",
        requestedAt: new Date("2024-01-20T09:00:00"),
        dueDate: new Date("2024-01-25T00:00:00"),
        amount: 2500,
        description: "HVAC System Maintenance - Annual Service",
        priority: "high",
        vendor: "ABC HVAC Services",
        category: "Maintenance",
        details: "Annual maintenance service for the HVAC system. Includes filter replacement, system inspection, and performance optimization.",
        attachments: ["quote.pdf", "maintenance_contract.pdf"],
        comments: [
          {
            id: "1",
            author: "Property Manager",
            content: "Received quote from vendor. Awaiting owner approval.",
            timestamp: new Date("2024-01-20T09:30:00")
          }
        ]
      },
      {
        id: "2",
        propertyId: "sunnyvale",
        propertyName: "Sunnyvale 432",
        ownerName: "Mike Chen",
        ownerEmail: "owner@sunnyvale.com",
        type: "repair",
        status: "pending",
        requestedAt: new Date("2024-01-20T08:30:00"),
        dueDate: new Date("2024-01-22T00:00:00"),
        amount: 850,
        description: "Emergency Plumbing Repair - Kitchen Sink",
        priority: "high",
        vendor: "Quick Plumb Inc",
        category: "Emergency Repairs",
        details: "Kitchen sink is leaking and causing water damage. Vendor has assessed and provided quote for immediate repair.",
        attachments: ["plumbing_quote.pdf", "damage_photos.zip"],
        comments: [
          {
            id: "1",
            author: "Property Manager",
            content: "Emergency repair needed. Sent urgent approval request to owner.",
            timestamp: new Date("2024-01-20T08:35:00")
          }
        ]
      },
      {
        id: "3",
        propertyId: "downtown",
        propertyName: "Downtown Lofts",
        ownerName: "Alex Rodriguez",
        ownerEmail: "owner@downtownlofts.com",
        type: "improvement",
        status: "approved",
        requestedAt: new Date("2024-01-19T15:00:00"),
        approvedAt: new Date("2024-01-20T10:00:00"),
        amount: 5000,
        description: "Kitchen Renovation - Countertop Replacement",
        priority: "medium",
        vendor: "Modern Interiors LLC",
        category: "Improvements",
        details: "Replace outdated kitchen countertops with quartz. Includes removal, installation, and minor cabinet modifications.",
        attachments: ["renovation_quote.pdf", "material_samples.pdf"],
        comments: [
          {
            id: "1",
            author: "Property Manager",
            content: "Submitted renovation proposal to owner",
            timestamp: new Date("2024-01-19T15:30:00")
          },
          {
            id: "2",
            author: "Alex Rodriguez",
            content: "Approved. Please proceed with the renovation.",
            timestamp: new Date("2024-01-20T10:00:00")
          }
        ]
      }
    ]
  }

  // Mock cards for technician
  const technicianCards = [
    { id: 't1', number: '**** 1122', holder: technicianName, balance: 1200, status: 'active' },
    { id: 't2', number: '**** 3344', holder: technicianName, balance: 800, status: 'active' },
  ];
  // Mock transactions for technician
  const technicianTransactions = [
    { id: 't1', date: '2025-01-15', vendor: 'Home Depot', amount: 120.5, status: 'pending', jobId: 'job1', billable: true, madeBy: 'Alice Johnson', cardHolder: 'Alice Johnson', memo: undefined, receipt: undefined },
    { id: 't2', date: '2025-01-14', vendor: 'Lowe\'s', amount: 89.99, status: 'reconciled', jobId: 'job1', billable: false, madeBy: 'Alice Johnson', cardHolder: 'Alice Johnson', memo: undefined, receipt: undefined },
    { id: 't3', date: '2025-01-13', vendor: 'Ace Hardware', amount: 45.00, status: 'pending', jobId: 'job1', billable: true, madeBy: 'Alice Johnson', cardHolder: 'Alice Johnson', memo: undefined, receipt: undefined },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "synced":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle className="h-3 w-3 mr-1" />
            Synced
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "balanced":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle className="h-3 w-3 mr-1" />
            Balanced
          </Badge>
        )
      case "variance":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            <AlertCircle className="h-3 w-3 mr-1" />
            Variance
          </Badge>
        )
      case "reconciled":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Reconciled</Badge>
      case "active":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "expense":
        return <Receipt className="h-4 w-4 text-red-400" />
      case "payment":
        return <DollarSign className="h-4 w-4 text-green-400" />
      case "report":
        return <FileText className="h-4 w-4 text-blue-400" />
      case "sync":
        return <Sync className="h-4 w-4 text-purple-400" />
      case "alert":
        return <AlertCircle className="h-4 w-4 text-yellow-400" />
      default:
        return <CheckCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const handlePayBills = (property: any) => {
    setSelectedProperty(property)
    setPaymentDialogOpen(true)
  }

  const handleGenerateReport = (property: any) => {
    setSelectedProperty(property)
    setReportDialogOpen(true)
  }

  const handleViewApproval = (approval: any) => {
    setSelectedApproval(approval)
    setApprovalDialogOpen(true)
  }

  // Handle reimbursement for work orders
  const handleReimburseWorkOrder = (job: any, amount: number) => {
    setSelectedReimbursementJob(job);
    setReimbursementAmount(amount);
    setReimbursementDialogOpen(true);
  };

  // Enhanced reimbursement processing
  const processReimbursement = () => {
    if (!selectedReimbursementJob || reimbursementAmount <= 0) return;
    
    // Get property information for owner contact
    const property = properties.find(p => p.name === selectedReimbursementJob.property);
    
    // Mock reimbursement processing
    console.log(`Processing reimbursement for ${selectedReimbursementJob.description}: $${reimbursementAmount}`);
    console.log(`Method: ${reimbursementMethod}, Date: ${reimbursementDate}`);
    
    // Send owner notification if requested
    if (ownerNotificationMethod !== 'none' && property) {
      const contactMethod = ownerNotificationMethod === 'email' ? property.ownerEmail : 
                           ownerNotificationMethod === 'phone' ? property.ownerPhone : 
                           ownerNotificationMethod === 'text' ? property.ownerPhone : '';
      console.log(`Sending ${ownerNotificationMethod} notification to ${property.ownerName} at ${contactMethod}`);
    }
    
    // Generate and send report if requested
    if (sendReportToOwner && property) {
      console.log(`Generating and sending expense report to ${property.ownerName} (${property.ownerEmail})`);
    }
    
    // Update transaction status to reconciled
    setTransactions(prev => prev.map(txn => 
      txn.jobId === selectedReimbursementJob.id 
        ? { ...txn, status: 'reconciled' as const }
        : txn
    ));
    
    // Show success message
    alert(`Reimbursement processed successfully!\n\nAmount: $${reimbursementAmount}\nMethod: ${reimbursementMethod}\n${sendReportToOwner ? 'Report sent to owner' : 'No report sent'}\n${ownerNotificationMethod !== 'none' ? `Owner notified via ${ownerNotificationMethod}` : 'No notification sent'}`);
    
    // Close dialog and reset state
    setReimbursementDialogOpen(false);
    setSelectedReimbursementJob(null);
    setReimbursementAmount(0);
    setReimbursementNote('');
    setReimbursementMethod('check');
    setSendReportToOwner(true);
    setReimbursementDate(new Date().toISOString().split('T')[0]);
    setOwnerNotificationMethod('email');
  };

  // Toggle work order expansion in payments tab
  const toggleWorkOrderExpansion = (jobId: string) => {
    setExpandedWorkOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  // Handle monthly report generation
  const handleGenerateMonthlyReport = (property: any) => {
    setSelectedReportProperty(property);
    setMonthlyReportDialogOpen(true);
  };

  // Generate monthly report data
  const generateMonthlyReportData = (property: any, month: string) => {
    const [year, monthNum] = month.split('-');
    const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(monthNum), 0);
    
    // Get all transactions for this property in the specified month
    const propertyJobs = jobs.filter(job => job.property === property.name);
    const propertyTransactions = [...transactions, ...technicianTransactions].filter(txn => {
      const job = jobs.find(j => j.id === txn.jobId);
      if (!job || job.property !== property.name) return false;
      
      const txnDate = new Date(txn.date);
      return txnDate >= startDate && txnDate <= endDate;
    });

    // Group by work order
    const workOrderGroups = propertyJobs.map(job => {
      const jobTransactions = propertyTransactions.filter(txn => txn.jobId === job.id);
      const totalAmount = jobTransactions.reduce((sum, txn) => sum + txn.amount, 0);
      const billableAmount = jobTransactions.filter(txn => txn.billable).reduce((sum, txn) => sum + txn.amount, 0);
      const nonBillableAmount = jobTransactions.filter(txn => !txn.billable).reduce((sum, txn) => sum + txn.amount, 0);
      
      return {
        job,
        transactions: jobTransactions,
        totalAmount,
        billableAmount,
        nonBillableAmount,
        transactionCount: jobTransactions.length
      };
    }).filter(group => group.transactions.length > 0);

    // Calculate totals
    const totalSpend = propertyTransactions.reduce((sum, txn) => sum + txn.amount, 0);
    const billableSpend = propertyTransactions.filter(txn => txn.billable).reduce((sum, txn) => sum + txn.amount, 0);
    const nonBillableSpend = propertyTransactions.filter(txn => !txn.billable).reduce((sum, txn) => sum + txn.amount, 0);
    const pendingAmount = propertyTransactions.filter(txn => txn.status === 'pending').reduce((sum, txn) => sum + txn.amount, 0);
    const reconciledAmount = propertyTransactions.filter(txn => txn.status === 'reconciled').reduce((sum, txn) => sum + txn.amount, 0);

    return {
      property,
      month,
      workOrderGroups,
      summary: {
        totalSpend,
        billableSpend,
        nonBillableSpend,
        pendingAmount,
        reconciledAmount,
        transactionCount: propertyTransactions.length,
        workOrderCount: workOrderGroups.length
      }
    };
  };

  // Export monthly report to CSV
  const exportMonthlyReportToCSV = (reportData: any) => {
    const { property, month, workOrderGroups, summary } = reportData;
    
    // Create CSV content
    let csvContent = `Monthly Spending Report - ${property.name}\n`;
    csvContent += `Month: ${month}\n\n`;
    
    // Summary section
    csvContent += `Summary\n`;
    csvContent += `Total Spend,${summary.totalSpend.toFixed(2)}\n`;
    csvContent += `Billable Spend,${summary.billableSpend.toFixed(2)}\n`;
    csvContent += `Non-Billable Spend,${summary.nonBillableSpend.toFixed(2)}\n`;
    csvContent += `Pending Amount,${summary.pendingAmount.toFixed(2)}\n`;
    csvContent += `Reconciled Amount,${summary.reconciledAmount.toFixed(2)}\n`;
    csvContent += `Total Transactions,${summary.transactionCount}\n`;
    csvContent += `Work Orders with Expenses,${summary.workOrderCount}\n\n`;
    
    // Work order details
    csvContent += `Work Order Details\n`;
    csvContent += `Work Order ID,Description,Technician,Total Amount,Billable Amount,Non-Billable Amount,Transaction Count\n`;
    
    workOrderGroups.forEach((group: any) => {
      csvContent += `${group.job.id},"${group.job.description}","${group.job.technician || 'Unassigned'}",${group.totalAmount.toFixed(2)},${group.billableAmount.toFixed(2)},${group.nonBillableAmount.toFixed(2)},${group.transactionCount}\n`;
    });
    
    csvContent += `\nTransaction Details\n`;
    csvContent += `Date,Vendor,Made By,Amount,Status,Billable,Work Order,Memo\n`;
    
    workOrderGroups.forEach((group: any) => {
      group.transactions.forEach((txn: any) => {
        csvContent += `${txn.date},"${txn.vendor}","${txn.madeBy}",${txn.amount.toFixed(2)},${txn.status},${txn.billable ? 'Yes' : 'No'},"${group.job.description}","${txn.memo || ''}"\n`;
      });
    });
    
    // Download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monthly-report-${property.name}-${month}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Sidebar tabs for each role
  const sidebarTabs =
    role === 'pm'
      ? [
          { id: 'dashboard', label: 'Dashboard', icon: Folder },
          { id: 'workorders', label: 'Work Orders', icon: FileText },
          { id: 'activity', label: 'Activity Log', icon: Zap },
          { id: 'wallet', label: 'Expenses', icon: CreditCard },
          { id: 'transactions', label: 'Transactions', icon: FileText },
          { id: 'collateral', label: 'Collateral Hub', icon: FileArchive },
          { id: 'properties', label: 'Properties', icon: Home },
          { id: 'staff', label: 'Technicians', icon: User },
        ]
      : role === 'centralOffice'
      ? [
          { id: 'dashboard', label: 'Dashboard', icon: Folder },
          { id: 'workorders', label: 'Work Orders', icon: FileText },
          { id: 'activity', label: 'Activity Log', icon: Zap },
          { id: 'cards', label: 'Cards', icon: CreditCard },
          { id: 'payments', label: 'Payments', icon: DollarSign },
          { id: 'policy', label: 'Expense Requests', icon: MessageSquare },
          { id: 'transactions', label: 'Transactions', icon: FileText },
          { id: 'collateral', label: 'Collateral Hub', icon: FileArchive },
          { id: 'properties', label: 'Properties', icon: Home },
          { id: 'staff', label: 'Technicians', icon: User },
        ]
      : [
          { id: 'dashboard', label: 'Dashboard', icon: Folder },
          { id: 'workorders', label: 'Work Orders', icon: FileText },
          { id: 'technicianExpenses', label: 'My Expenses', icon: CreditCard },
          { id: 'profile', label: 'Profile', icon: User },
        ];

  // Sample properties for dropdown
  const propertyOptions = [
    { id: 'prop1', name: 'Stanford GSB' },
    { id: 'prop2', name: 'Sunnyvale 432' },
  ]

  type JobType = typeof jobsList[0];

  // Helper for status badge style
  const getStatusBadgeClass = (statusValue: string) => {
    if (statusValue === 'approved') return 'bg-green-700 text-green-100';
    if (statusValue === 'pending') return 'bg-gray-700 text-gray-200';
    if (statusValue === 'rejected') return 'bg-red-700 text-red-100';
    return 'bg-gray-700 text-gray-300';
  }

  // Helper to get time since sent (mocked for now)
  function getTimeSince(dateString: string) {
    const now = new Date();
    const sent = new Date(dateString);
    const diff = Math.floor((now.getTime() - sent.getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
    return `${Math.floor(diff/86400)}d ago`;
  }

  function addNote() {
    if (!notesJob || !newNote.trim()) return;
    setJobNotes(prev => ({
      ...prev,
      [notesJob.id]: [
        ...(prev[notesJob.id] || []),
        {
          author: role === 'technician' ? technicianName : 'Property Manager',
          content: newNote.trim(),
          timestamp: new Date().toISOString(),
        },
      ],
    }));
    setNewNote("");
  }

  const router = useRouter();

  // Helper: get jobs by status
  const openJobs = jobs.filter(j => j.techStatus !== 'Finished');
  const pendingOwnerApprovals = jobs.filter(j => j.preApprovalStatus === 'Required' && j.statusValue === 'pending');
  const jobsAssignedToSubs = jobs.filter(j => j.technician && (j.techStatus === 'Started' || j.techStatus === 'Not Started'));
  const overdueJobs = jobs.filter(j => {
    // For demo, overdue if requested date is >7 days ago and not finished
    const daysAgo = (dateStr: string) => {
      const now = new Date();
      const d = new Date(dateStr);
      return (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
    };
    return j.techStatus !== 'Finished' && daysAgo(j.requested) > 7;
  });

  // Helper: get current month transactions
  const allTxns = [...transactions, ...technicianTransactions];
  const isThisMonth = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  };
  const txnsThisMonth = allTxns.filter(txn => isThisMonth(txn.date));
  
  // Override with realistic fixed amounts that add up correctly for dashboard
  const totalSpend = 18750.00;  // Total monthly expenses
  const billableSpend = 14250.00;  // Billable to owners (76%)
  const nonBillableSpend = 4500.00;  // Non-billable expenses (24%)
  const uncategorizedSpend = 2850.00;  // Needs review/categorization
  
  // Reimbursement overview calculations (for Central Office dashboard)
  const reconciledSpend = 11400.00;  // Already reimbursed
  const pendingBillableSpend = 2850.00;  // Awaiting reimbursement (pending + billable)
  const issuesSpend = 4500.00;  // Issues/needs review (no job assignment)

  function handleSmartAssistSend() {
    if (!smartAssistInput.trim()) return;
    setSmartAssistChat((prev) => [
      ...prev,
      { role: 'user', content: smartAssistInput.trim() },
      { role: 'assistant', content: `This is a mock answer to: "${smartAssistInput.trim()}". (LLM integration coming soon!)` }
    ]);
    setSmartAssistInput("");
  }

  // Helper to filter transactions
  const filteredTransactions = [...transactions, ...technicianTransactions].filter(txn => {
    const job = jobs.find(j => j.id === txn.jobId);
    const property = job ? properties.find(p => p.name === job.property) : undefined;
    let pass = true;
    if (txnFilterStatus !== 'all') pass = pass && txn.status === txnFilterStatus;
    if (txnFilterBillable !== 'all') pass = pass && ((txnFilterBillable === 'billable' && txn.billable) || (txnFilterBillable === 'nonbillable' && !txn.billable));
    if (txnFilterProperty !== 'all') pass = pass && !!property && property.id === txnFilterProperty;
    if (txnFilterJob !== 'all') pass = pass && txn.jobId === txnFilterJob;
    if (txnFilterDateFrom) pass = pass && new Date(txn.date) >= new Date(txnFilterDateFrom);
    if (txnFilterDateTo) pass = pass && new Date(txn.date) <= new Date(txnFilterDateTo);
    if (txnFilterMadeBy !== 'all') pass = pass && txn.madeBy === txnFilterMadeBy;
    return pass;
  });

  // Helper to get transactions that need review
  const getTransactionsNeedingReview = () => {
    return [...transactions, ...technicianTransactions].filter(txn => {
      // Check if transaction has a review flag
      if (transactionReviewFlags[txn.id]) return true;
      
      // Check for missing critical information
      if (!txn.receipt) return true;
      if (!txn.memo) return true;
      if (!txn.jobId) return true;
      
      // Check for unusual amounts (over $1000)
      if (txn.amount > 1000) return true;
      
      return false;
    });
  };

  // Helper to validate new transaction form
  const validateNewTransactionForm = () => {
    const errors: Record<string, string> = {};
    if (!newTransactionForm.date) errors.date = 'Date is required';
    if (!newTransactionForm.vendor) errors.vendor = 'Vendor is required';
    if (!newTransactionForm.amount) errors.amount = 'Amount is required';
    if (!newTransactionForm.madeBy) errors.madeBy = 'Made By is required';
    if (!newTransactionForm.cardHolder) errors.cardHolder = 'Card Holder is required';
    if (!newTransactionForm.property) errors.property = 'Property is required';
    if (!newTransactionForm.memo) errors.memo = 'Memo is required';
    return errors;
  };

  // Helper to create new transaction
  const handleCreateNewTransaction = () => {
    const errors = validateNewTransactionForm();
    if (Object.keys(errors).length > 0) {
      // Handle validation errors (could show toast or set error state)
      console.log('Validation errors:', errors);
      return;
    }

    const newTxn: Transaction = {
      id: `txn-${Date.now()}`,
      date: newTransactionForm.date,
      vendor: newTransactionForm.vendor,
      amount: parseFloat(newTransactionForm.amount),
      status: 'pending',
      billable: newTransactionForm.billable,
      jobId: newTransactionForm.job === 'none' ? '' : newTransactionForm.job,
      madeBy: newTransactionForm.madeBy,
      cardHolder: newTransactionForm.cardHolder,
      memo: newTransactionForm.memo,
      receipt: newTransactionForm.receipt
    };

    setTransactions(prev => [...prev, newTxn]);
    setNewTransactionDialogOpen(false);
    setNewTransactionForm({
      date: '',
      vendor: '',
      amount: '',
      madeBy: '',
      cardHolder: '',
      property: '',
      job: '',
      billable: true,
      memo: '',
      receipt: ''
    });
  };

  // Helper to open edit transaction dialog
  const handleEditTransaction = (transaction: Transaction) => {
    const job = jobs.find(j => j.id === transaction.jobId);
    const property = job ? properties.find(p => p.name === job.property) : undefined;
    
    setEditingTransaction(transaction);
    setEditTransactionForm({
      date: transaction.date,
      vendor: transaction.vendor,
      amount: transaction.amount.toString(),
      madeBy: transaction.madeBy,
      cardHolder: transaction.cardHolder || '',
      property: property ? property.name : '',
      job: transaction.jobId || 'none',
      billable: transaction.billable,
      memo: transaction.memo || '',
      receipt: transaction.receipt || ''
    });
    setEditTransactionDialogOpen(true);
  };

  // Helper to update transaction
  const handleUpdateTransaction = () => {
    if (!editingTransaction) return;

    const updatedTxn: Transaction = {
      ...editingTransaction,
      date: editTransactionForm.date,
      vendor: editTransactionForm.vendor,
      amount: parseFloat(editTransactionForm.amount),
      billable: editTransactionForm.billable,
      jobId: editTransactionForm.job === 'none' ? '' : editTransactionForm.job,
      madeBy: editTransactionForm.madeBy,
      cardHolder: editTransactionForm.cardHolder,
      memo: editTransactionForm.memo,
      receipt: editTransactionForm.receipt
    };

    setTransactions(prev => prev.map(txn => txn.id === editingTransaction.id ? updatedTxn : txn));
    setEditTransactionDialogOpen(false);
    setEditingTransaction(null);
    setEditTransactionForm({
      date: '',
      vendor: '',
      amount: '',
      madeBy: '',
      cardHolder: '',
      property: '',
      job: '',
      billable: true,
      memo: '',
      receipt: ''
    });
  };

  // Helper to filter expenses by role (for technicians, only show their own expenses)
  const filterExpensesByRole = (expenses: (Transaction | typeof technicianTransactions[0])[]) => {
    return expenses.filter(txn => {
      if (role === 'technician') {
        // For technicians, only show expenses from their own cards
        return txn.cardHolder === technicianName;
      } else if (role === 'pm') {
        // For PM, show all expenses (they can see everything)
        return true;
      } else if (role === 'centralOffice') {
        // For Central Office, show all expenses (they can see everything)
        return true;
      }
      return true;
    });
  };

  // Export to CSV (browser-based, no dependency)
  function exportTransactionsToCSV() {
    const headers = [
      'Date', 'Merchant', 'Amount', 'Made By', 'Property', 'Job', 'Billable', 'Memo', 'Receipt'
    ];
    const rows = filteredTransactions.map(txn => {
      const job = jobs.find(j => j.id === txn.jobId);
      const property = job ? properties.find(p => p.name === job.property) : undefined;
      return [
        txn.date,
        txn.vendor,
        txn.amount,
        txn.madeBy,
        property ? property.name : '',
        job ? job.description : '',
        txn.billable ? 'Billable' : 'Non-Billable',
        txn.memo || '',
        txn.receipt || ''
      ];
    });
    const csv = [headers, ...rows].map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  }

  const validateWorkOrderForm = () => {
    const errors: Record<string, string> = {};
    if (!newWorkOrder.property) errors.property = 'Property is required';
    if (!newWorkOrder.description) errors.description = 'Description is required';
    if (!newWorkOrder.priority) errors.priority = 'Priority is required';
    if (!newWorkOrder.cost) errors.cost = 'Estimated cost is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateWorkOrder = () => {
    if (!validateWorkOrderForm()) return;
    
    // Auto-set approval status based on cost
    const finalApprovalStatus = Number(newWorkOrder.cost) >= 1000 ? 'Required' : 'Not Required';
    
    const newJob = {
      id: `job-${Date.now()}`,
      property: newWorkOrder.property,
      description: newWorkOrder.description,
      preApprovalStatus: finalApprovalStatus,
      technician: 'Unassigned',
      techStatus: 'Not Started',
      requested: new Date().toLocaleDateString(),
      owner: 'PM',
      priority: newWorkOrder.priority,
      status: 'Open',
      statusValue: 'open',
      notes: newWorkOrder.notes || '',
      cost: Number(newWorkOrder.cost) || 0
    };

    setJobs(prev => [...prev, newJob]);
    
    // If approval is required, show the approval workflow
    if (finalApprovalStatus === 'Required') {
      setPendingJob(newJob);
      setShowPreApprovalDialog(true);
    }
    
    setNewJobDialogOpen(false);
    setNewWorkOrder({
      property: '',
      description: '',
      
      notes: '',
      cost: '',
      priority: 'Medium'
    });
    setFormErrors({});
  };

  const handleUpdateWorkOrder = () => {
    if (!editJob || !editJobForm.property || !editJobForm.description) return;
    
    const updatedJob = {
      ...editJob,
      property: editJobForm.property,
      description: editJobForm.description,
      cost: Number(editJobForm.cost) || 0,
      priority: editJobForm.priority
    };

    setJobs(prev => prev.map(job => job.id === editJob.id ? updatedJob : job));
    
    setEditJobDialogOpen(false);
    setEditJob(null);
    setEditJobForm({
      property: '',
      description: '',
      cost: '',
      priority: 'Medium'
    });
  };

  // State for Smart Assist drawer
  const [smartAssistOpen, setSmartAssistOpen] = useState(false);

  // State for approval file uploads per job
  const [approvalFiles, setApprovalFiles] = useState<{ [jobId: string]: File | null }>({});

  // Add state for viewing technician work orders
  const [viewTechnicianWorkOrders, setViewTechnicianWorkOrders] = useState<string | null>(null);
  
  // Add state for transaction details dialog
  const [transactionDetailsOpen, setTransactionDetailsOpen] = useState(false);

  // Get current user name based on role
  const getCurrentUserName = () => {
    if (role === 'technician') {
      return technicianName;
    } else if (role === 'pm') {
      return 'Property Manager'; // PM can see all expenses
    } else if (role === 'centralOffice') {
      return 'Central Office'; // Central Office can see all expenses
    }
    return '';
  };

  // Helper to filter work orders by role (for technicians, only show their assigned work orders)
  const filterWorkOrdersByRole = (workOrders: typeof jobs) => {
    if (role === 'technician') {
      // For technicians, only show work orders assigned to them
      return workOrders.filter(job => job.technician === technicianName);
    } else if (role === 'pm') {
      // For PM, show all work orders (they can see everything)
      return workOrders;
    } else {
      // For Central Office, show all work orders
      return workOrders;
    }
  };

  // Get technician-specific data for Dashboard
  const technicianWorkOrders = filterWorkOrdersByRole(jobs);
  const technicianExpenses = filterExpensesByRole([...transactions, ...technicianTransactions]);
  
  // Calculate technician-specific KPIs
  const technicianOpenJobs = technicianWorkOrders.filter(job => job.statusValue === 'open');
  const technicianInProgressJobs = technicianWorkOrders.filter(job => job.techStatus === 'In Progress');
  const technicianFinishedJobs = technicianWorkOrders.filter(job => job.techStatus === 'Finished');
  const technicianOverdueJobs = technicianWorkOrders.filter(job => {
    const dueDate = new Date(job.requested);
    const today = new Date();
    return dueDate < today && job.statusValue !== 'closed';
  });

  // Calculate technician-specific expense KPIs
  const technicianTxnsThisMonth = technicianExpenses.filter(txn => isThisMonth(txn.date));
  const technicianTotalSpend = technicianTxnsThisMonth.reduce((sum, txn) => sum + txn.amount, 0);
  const technicianBillableSpend = technicianTxnsThisMonth.filter(txn => txn.billable).reduce((sum, txn) => sum + txn.amount, 0);
  const technicianNonBillableSpend = technicianTxnsThisMonth.filter(txn => !txn.billable).reduce((sum, txn) => sum + txn.amount, 0);
  const technicianUncategorized = technicianTxnsThisMonth.filter(txn => !txn.jobId || txn.status === 'pending');
  const technicianUncategorizedSpend = technicianUncategorized.reduce((sum, txn) => sum + txn.amount, 0);

  // Helper to calculate YTD spending for a property
  // Card management functions
  const handleIssueNewCard = () => {
    const newCard: EnhancedCard = {
      id: `card-${Date.now()}`,
      type: cardForm.type,
      number: `**** ${Math.floor(1000 + Math.random() * 9000)}`,
      holder: cardForm.holder,
      position: cardForm.position,
      balance: Number(cardForm.limit) * 0.8, // Start with 80% available
      limit: Number(cardForm.limit),
      status: 'active',
      assignedProperties: cardForm.assignedProperties,
      vendorRestrictions: cardForm.vendorRestrictions,
      isExistingCard: cardForm.isExistingCard,
      brand: cardForm.brand,
      expiryDate: '12/28',
      lastUsed: 'Never',
      monthlySpend: 0,
      assignedStaff: cardForm.assignedStaff
    };

    // Add to enhanced cards (in a real app, this would call an API)
    enhancedCards.push(newCard);
    
    // Reset form and close dialog
    setCardForm({
    type: 'virtual',
      holder: '',
    position: 'Technician',
      limit: '',
      assignedProperties: [],
      vendorRestrictions: [],
      isExistingCard: false,
      brand: 'Chase',
      assignedStaff: []
    });
    setIssueCardDialogOpen(false);
  };

  const handleConnectExistingCard = () => {
    const connectedCard: EnhancedCard = {
      id: `connected-card-${Date.now()}`,
      type: cardForm.type,
      number: `**** ${Math.floor(1000 + Math.random() * 9000)}`,
      holder: cardForm.holder,
      position: cardForm.position,
      balance: Number(cardForm.limit) * 0.6, // Existing card might have usage
      limit: Number(cardForm.limit),
    status: 'active',
      assignedProperties: cardForm.assignedProperties,
      vendorRestrictions: cardForm.vendorRestrictions,
      isExistingCard: true, // Mark as connected existing card
      brand: cardForm.brand,
      expiryDate: '06/27',
      lastUsed: '5 days ago',
      monthlySpend: Math.floor(Math.random() * 500),
      assignedStaff: cardForm.assignedStaff
    };

    // Add to enhanced cards (in a real app, this would call an API)
    enhancedCards.push(connectedCard);
    
    // Reset form and close dialog
    setCardForm({
      type: 'virtual',
      holder: '',
      position: 'Technician',
      limit: '',
      assignedProperties: [],
      vendorRestrictions: [],
    isExistingCard: false,
    brand: 'Chase',
      assignedStaff: []
    });
    setConnectCardDialogOpen(false);
  };

  // Expense request handling functions
  const handleApproveExpenseRequest = (requestId: string) => {
    setExpenseRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'approved' as const } : req
    ));
  };

  const handleDenyExpenseRequest = (requestId: string) => {
    setExpenseRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'denied' as const } : req
    ));
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-400 bg-red-900/20';
      case 'normal': return 'text-yellow-400 bg-yellow-900/20';
      case 'low': return 'text-green-400 bg-green-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-400 bg-green-900/20';
      case 'denied': return 'text-red-400 bg-red-900/20';
      case 'pending': return 'text-yellow-400 bg-yellow-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'billable_question': return 'Billability';
      case 'approval_required': return 'Pre-approval';
      case 'policy_clarification': return 'Policy';
      case 'receipt_issue': return 'Documentation';
      case 'amount_verification': return 'Amount Check';
      default: return 'General';
    }
  };

  const getPropertyYTDSpending = (propertyName: string) => {
    const currentYear = new Date().getFullYear();
    const propertyJobs = jobs.filter(job => job.property === propertyName);
    const propertyTransactions = [...transactions, ...technicianTransactions].filter(txn => {
      const job = jobs.find(j => j.id === txn.jobId);
      if (!job || job.property !== propertyName) return false;
      
      const txnDate = new Date(txn.date);
      return txnDate.getFullYear() === currentYear;
    });
    
    return propertyTransactions.reduce((sum, txn) => sum + txn.amount, 0);
  };

  // Enhanced functions for new functionality
  const handleEditPolicyRule = (rule: any) => {
    setEditingPolicyRule(rule);
    setEditedRule({
      category: rule.category,
      rule: rule.rule,
      aiEnabled: rule.aiEnabled,
      active: rule.active
    });
    setPolicyRuleEditDialogOpen(true);
  };

  const handleSavePolicyRule = () => {
    if (editingPolicyRule) {
      setPolicyRules(prev => prev.map(rule => 
        rule.id === editingPolicyRule.id 
          ? { ...rule, ...editedRule }
          : rule
      ));
      setPolicyRuleEditDialogOpen(false);
      setEditingPolicyRule(null);
    }
  };

  const handleMonthlyReimbursement = (property: any, month: string) => {
    setSelectedPropertyForMonthly(property);
    setSelectedMonth(month);
    setMonthlyReimbursementDialogOpen(true);
  };

  const processMonthlyReimbursement = () => {
    if (!selectedPropertyForMonthly) return;
    
    // Mock processing - in real app would call API
    console.log(`Processing monthly reimbursement for ${selectedPropertyForMonthly.name} for ${selectedMonth}`);
    if (ccRecipient.email) {
      console.log(`CC'ing report to ${ccRecipient.name} (${ccRecipient.email})`);
    }
    
    // Close dialog and reset state
    setMonthlyReimbursementDialogOpen(false);
    setSelectedPropertyForMonthly(null);
    setCcRecipient({ name: '', email: '' });
  };

  // Optimized Collateral Hub Helper Functions with memoization
  const filteredCollateralDocs = useMemo(() => {
    // Show previous results while searching to prevent UI freezing
    if (collateralIsSearching && collateralDebouncedSearchQuery !== '') {
      // Return previous results to maintain UI responsiveness
      return collateralDocs;
    }
    
    return collateralDocs.filter(doc => {
      // Use only debounced search query for filtering
      const searchQuery = collateralDebouncedSearchQuery;
      
      // Search query filter - only apply if debounced query exists
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = (
          doc.filename.toLowerCase().includes(query) ||
          doc.description?.toLowerCase().includes(query) ||
          doc.tags.some(tag => tag.toLowerCase().includes(query)) ||
          doc.linkedVendor?.toLowerCase().includes(query)
        );
        if (!matchesSearch) return false;
      }
      
      // Property filter
      if (collateralFilterProperty !== 'all' && doc.propertyId !== collateralFilterProperty) {
        return false;
      }
      
      // Document type filter
      if (collateralFilterDocType !== 'all' && doc.documentType !== collateralFilterDocType) {
        return false;
      }
      
      // Uploaded by filter
      if (collateralFilterUploadedBy !== 'all' && doc.uploadedBy !== collateralFilterUploadedBy) {
        return false;
      }
      
      // Date range filter
      if (collateralFilterDateFrom && new Date(doc.uploadDate) < new Date(collateralFilterDateFrom)) {
        return false;
      }
      if (collateralFilterDateTo && new Date(doc.uploadDate) > new Date(collateralFilterDateTo)) {
        return false;
      }
      
      return true;
    });
  }, [
    collateralDocs,
    collateralDebouncedSearchQuery,
    collateralFilterProperty,
    collateralFilterDocType,
    collateralFilterUploadedBy,
    collateralFilterDateFrom,
    collateralFilterDateTo,
    collateralIsSearching
  ]);

  const handleCollateralUpload = useCallback(() => {
    if (collateralUploadForm.files.length === 0) return;
    
    const newDocs: CollateralDocument[] = collateralUploadForm.files.map((file, index) => ({
      id: `doc_${Date.now()}_${index}`,
      filename: file.name,
      documentType: collateralUploadForm.documentType,
      uploadDate: new Date().toISOString().split('T')[0],
      uploadedBy: getCurrentUserName(),
      propertyId: collateralUploadForm.propertyId,
      propertyName: propertyOptions.find(p => p.id === collateralUploadForm.propertyId)?.name || '',
      glExpenseId: collateralUploadForm.linkedExpenseId || undefined,
      tags: collateralUploadForm.tags,
      fileSize: file.size,
      fileUrl: URL.createObjectURL(file),
      description: collateralUploadForm.description || undefined,
      linkedJobId: collateralUploadForm.linkedJobId || undefined,
      linkedVendor: collateralUploadForm.linkedVendor || undefined,
      amount: collateralUploadForm.amount ? parseFloat(collateralUploadForm.amount) : undefined,
      expiryDate: collateralUploadForm.expiryDate || undefined,
      status: 'active'
    }));
    
    setCollateralDocs(prev => [...prev, ...newDocs]);
    setCollateralUploadDialogOpen(false);
    
    // Reset form
    setCollateralUploadForm({
      files: [],
      documentType: 'other',
      propertyId: '',
      tags: [],
      newTag: '',
      description: '',
      linkedExpenseId: '',
      linkedJobId: '',
      linkedVendor: '',
      amount: '',
      expiryDate: ''
    });
  }, [collateralUploadForm]);

  const handleCollateralAIQuery = (query: string) => {
    setCollateralAIQuery(query);
    
    // Mock AI processing - in real app would call AI API
    let results: CollateralDocument[] = [];
    
    if (query.toLowerCase().includes('warranty') && query.toLowerCase().includes('2025')) {
      results = collateralDocs.filter(doc => 
        doc.documentType === 'warranty' && 
        doc.expiryDate && 
        doc.expiryDate.includes('2025')
      );
    } else if (query.toLowerCase().includes('sarah chen')) {
      results = collateralDocs.filter(doc => doc.uploadedBy === 'Sarah Chen');
    } else if (query.toLowerCase().includes('invoice') && query.toLowerCase().includes('5000')) {
      results = collateralDocs.filter(doc => 
        doc.documentType === 'invoice' && 
        doc.amount && 
        doc.amount >= 5000
      );
    } else if (query.toLowerCase().includes('insurance') && query.toLowerCase().includes('redwood shores')) {
      results = collateralDocs.filter(doc => 
        doc.documentType === 'insurance_certificate' && 
        doc.propertyName === 'Redwood Shores'
      );
    } else {
      // Generic search
      results = collateralDocs.filter(doc => {
        const searchTerms = query.toLowerCase().split(' ');
        return searchTerms.some(term => 
          doc.filename.toLowerCase().includes(term) ||
          doc.description?.toLowerCase().includes(term) ||
          doc.tags.some(tag => tag.toLowerCase().includes(term))
        );
      });
    }
    
    setCollateralAIResults(results);
  };

  const handleCollateralDocPreview = (doc: CollateralDocument) => {
    setSelectedCollateralDoc(doc);
    setCollateralPreviewDialogOpen(true);
  };

  const handleCollateralExportSelected = () => {
    if (collateralSelectedDocs.length === 0) return;
    
    // Mock export - in real app would create zip file
    console.log('Exporting documents:', collateralSelectedDocs);
    
    // Create mock download
    const selectedDocsData = collateralDocs.filter(doc => collateralSelectedDocs.includes(doc.id));
    const csvContent = [
      ['Filename', 'Document Type', 'Upload Date', 'Uploaded By', 'Property', 'Tags', 'Amount'],
      ...selectedDocsData.map(doc => [
        doc.filename,
        documentTypeLabels[doc.documentType],
        doc.uploadDate,
        doc.uploadedBy,
        doc.propertyName,
        doc.tags.join(', '),
        doc.amount?.toString() || ''
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'collateral_documents_export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getDocumentTypeIcon = (docType: DocumentType) => {
    switch (docType) {
      case 'vendor_contract': return FileText;
      case 'warranty': return Award;
      case 'insurance_certificate': return FileCheck;
      case 'bid_response': return Receipt;
      case 'receipt': return Receipt;
      case 'invoice': return DollarSign;
      case 'communication_log': return MessageSquare;
      case 'compliance_doc': return FileWarning;
      default: return FileText;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // AI Search functionality
  const getAiSearchSuggestions = (query: string) => {
    const roleSuggestions = {
      pm: [
        // HVAC & Heating/Cooling
        "How much did we spend on HVAC repairs this year?",
        "Find all HVAC maintenance contracts",
        "Show me heating system invoices from last winter",
        "What HVAC vendors do we use most frequently?",
        "Find air conditioning repair receipts over $500",
        "Show me all furnace replacement quotes",
        "Find HVAC emergency repair calls",
        "What properties need HVAC filter replacements?",
        "Show me duct cleaning service records",
        "Find thermostat installation receipts",
        "What HVAC warranties are expiring soon?",
        "Show me cooling system maintenance logs",
        
        // Plumbing
        "Find all plumbing repair receipts",
        "Show me water damage insurance claims",
        "What plumbing emergencies happened this month?",
        "Find pipe replacement invoices",
        "Show me toilet repair receipts",
        "Find water heater maintenance records",
        "What plumbing vendors charge the most?",
        "Show me leak detection service calls",
        "Find drain cleaning receipts",
        "Show me faucet replacement invoices",
        "Find water pressure issue reports",
        "What plumbing warranties do we have?",
        
        // Electrical
        "Find all electrical repair invoices",
        "Show me panel upgrade receipts",
        "What electrical permits do we have?",
        "Find outlet installation costs",
        "Show me lighting repair receipts",
        "Find electrical inspection reports",
        "What electrical emergencies occurred?",
        "Show me wiring replacement quotes",
        "Find circuit breaker repair costs",
        "Show me electrical safety certificates",
        "Find generator maintenance records",
        "What electrical contractors do we use?",
        
        // Roofing
        "Find all roofing repair receipts",
        "Show me roof replacement quotes",
        "What roofing warranties are active?",
        "Find gutter cleaning service records",
        "Show me leak repair invoices",
        "Find roofing inspection reports",
        "What roofing materials did we purchase?",
        "Show me shingle replacement costs",
        "Find roof maintenance contracts",
        "Show me storm damage assessments",
        "Find chimney repair receipts",
        "What roofing vendors do we recommend?",
        
        // Flooring
        "Find all flooring replacement receipts",
        "Show me carpet cleaning service records",
        "What flooring warranties are valid?",
        "Find hardwood floor refinishing costs",
        "Show me tile repair invoices",
        "Find flooring installation quotes",
        "What flooring vendors do we use?",
        "Show me subfloor repair receipts",
        "Find laminate flooring purchases",
        "Show me floor polishing service records",
        "Find vinyl flooring installation costs",
        "What flooring inspections were done?",
        
        // Painting & Drywall
        "Find all painting service receipts",
        "Show me drywall repair invoices",
        "What paint supplies did we purchase?",
        "Find exterior painting quotes",
        "Show me interior painting costs",
        "Find drywall installation receipts",
        "What painting contractors do we use?",
        "Show me wallpaper removal costs",
        "Find texture repair invoices",
        "Show me primer and paint purchases",
        "Find painting equipment rental receipts",
        "What painting warranties are active?",
        
        // Appliances
        "Find all appliance repair receipts",
        "Show me refrigerator replacement costs",
        "What appliance warranties are valid?",
        "Find dishwasher installation invoices",
        "Show me washer and dryer repair costs",
        "Find oven and stove maintenance records",
        "What appliance vendors do we use?",
        "Show me microwave replacement receipts",
        "Find garbage disposal repair costs",
        "Show me appliance delivery receipts",
        "Find extended warranty purchases",
        "What appliances need replacement soon?",
        
        // Landscaping & Grounds
        "Find all landscaping service receipts",
        "Show me lawn care maintenance costs",
        "What landscaping contracts are active?",
        "Find tree removal service invoices",
        "Show me irrigation system repair costs",
        "Find fertilizer and pesticide purchases",
        "What landscaping equipment did we buy?",
        "Show me snow removal service receipts",
        "Find sprinkler system maintenance records",
        "Show me mulch and soil purchases",
        "Find landscaping design costs",
        "What seasonal maintenance was done?",
        
        // Security & Safety
        "Find all security system receipts",
        "Show me fire alarm inspection reports",
        "What security equipment did we install?",
        "Find smoke detector replacement costs",
        "Show me security camera installation invoices",
        "Find access control system receipts",
        "What safety inspections were completed?",
        "Show me emergency lighting maintenance",
        "Find security monitoring service costs",
        "Show me lock replacement receipts",
        "Find fire extinguisher service records",
        "What security upgrades were made?",
        
        // Cleaning & Maintenance
        "Find all cleaning service receipts",
        "Show me janitorial supply purchases",
        "What cleaning contracts are active?",
        "Find carpet cleaning service costs",
        "Show me window cleaning receipts",
        "Find pressure washing service invoices",
        "What cleaning equipment did we buy?",
        "Show me floor waxing service records",
        "Find sanitization service costs",
        "Show me cleaning supply deliveries",
        "Find deep cleaning service receipts",
        "What maintenance schedules are due?",
        
        // Property-Specific Queries
        "Find all receipts for Stanford GSB property",
        "Show me Sunnyvale 432 maintenance costs",
        "What repairs were done at Menlo Park?",
        "Find all Palo Alto Office expenses",
        "Show me Stanford GSB inspection reports",
        "What vendors service Sunnyvale 432?",
        "Find Menlo Park utility bills",
        "Show me Palo Alto Office insurance docs",
        "What maintenance is scheduled for Stanford GSB?",
        "Find all multi-property service contracts",
        
        // Financial & Cost Analysis
        "What were the most expensive repairs last quarter?",
        "Find receipts where we were overcharged",
        "Show me all expenses over $1000",
        "What maintenance costs exceeded budget?",
        "Find all emergency repair costs",
        "Show me year-over-year cost comparisons",
        "What vendors have the highest invoices?",
        "Find all tax-deductible expenses",
        "Show me monthly spending trends",
        "What repairs had cost overruns?",
        "Find all warranty claim savings",
        "Show me preventive vs reactive maintenance costs",
        
        // Vendor & Contractor Management
        "Find all Home Depot receipts",
        "Show me Lowe's purchase history",
        "What contractors do we use most?",
        "Find all vendor contact information",
        "Show me contractor performance reviews",
        "What vendors offer the best rates?",
        "Find all vendor insurance certificates",
        "Show me contractor licensing documents",
        "What vendors have payment terms?",
        "Find all preferred vendor agreements",
        "Show me vendor response time reports",
        "What contractors specialize in emergencies?",
        
        // Insurance & Claims
        "Find all insurance certificates",
        "Show me property insurance claims",
        "What insurance policies are expiring?",
        "Find liability insurance documents",
        "Show me workers comp certificates",
        "Find all insurance claim receipts",
        "What insurance coverage do we have?",
        "Show me insurance premium payments",
        "Find all damage assessment reports",
        "Show me insurance adjuster communications",
        "What claims are still pending?",
        "Find all insurance policy renewals",
        
        // Compliance & Inspections
        "Show me inspection reports that mention mold",
        "Find all safety inspection certificates",
        "What compliance documents are due?",
        "Show me fire safety inspection reports",
        "Find all building permit applications",
        "What health department inspections occurred?",
        "Show me elevator inspection certificates",
        "Find all environmental compliance docs",
        "What code violations need addressing?",
        "Show me occupancy permit renewals",
        "Find all accessibility compliance reports",
        "What inspections are scheduled this month?",
        
        // Contracts & Agreements
        "Find contracts expiring in the next 30 days",
        "Show me all service agreements",
        "What maintenance contracts are active?",
        "Find all vendor agreements",
        "Show me lease agreement amendments",
        "Find all warranty documents",
        "What contracts need renewal soon?",
        "Show me all purchase agreements",
        "Find contractor licensing agreements",
        "Show me all service level agreements",
        "What contracts have auto-renewal clauses?",
        "Find all non-disclosure agreements",
        
        // Utilities & Services
        "Find all utility bills this year",
        "Show me electricity usage reports",
        "What utility vendors do we use?",
        "Find all water and sewer bills",
        "Show me gas utility expenses",
        "Find internet and cable service costs",
        "What utility deposits did we pay?",
        "Show me utility connection fees",
        "Find all utility meter readings",
        "Show me energy efficiency reports",
        "What utility rebates did we receive?",
        "Find all utility service agreements",
        
        // Emergency & Urgent Repairs
        "Show me all emergency repair receipts",
        "Find after-hours service call costs",
        "What emergency repairs happened last month?",
        "Show me weekend emergency expenses",
        "Find all urgent maintenance requests",
        "What emergency vendors do we use?",
        "Show me holiday emergency repair costs",
        "Find all emergency contact information",
        "What emergencies required multiple visits?",
        "Show me emergency repair response times",
        "Find all emergency equipment rentals",
        "What emergency repairs exceeded estimates?",
        
        // Seasonal & Weather-Related
        "Find all winter weather damage costs",
        "Show me summer cooling system repairs",
        "What storm damage occurred this year?",
        "Find all freeze damage repair receipts",
        "Show me seasonal maintenance schedules",
        "Find all weather-related insurance claims",
        "What seasonal equipment rentals occurred?",
        "Show me ice dam removal costs",
        "Find all spring maintenance receipts",
        "Show me fall preparation service costs",
        "What weather monitoring equipment do we have?",
        "Find all seasonal vendor agreements"
      ],
      centralOffice: [
        // Approvals & Review
        "Show me all pending approvals",
        "Find high-value transactions needing review",
        "What expenses require CO approval?",
        "Show me all flagged transactions",
        "Find all contracts requiring CO approval",
        "What large purchases need authorization?",
        "Show me all budget variance reports",
        "Find all emergency spending approvals",
        "What vendor agreements need CO review?",
        "Show me all policy exception requests",
        "Find all capital expenditure approvals",
        "What insurance claims need CO review?",
        
        // Property Performance & Analytics
        "What properties have the highest maintenance costs?",
        "Show me property performance rankings",
        "Find all underperforming properties",
        "What properties exceed budget most often?",
        "Show me property ROI comparisons",
        "Find all property efficiency reports",
        "What properties need capital improvements?",
        "Show me tenant satisfaction by property",
        "Find all property vacancy reports",
        "What properties have recurring issues?",
        "Show me property maintenance trends",
        "Find all property valuation reports",
        
        // Compliance & Risk Management
        "Show me all compliance documents",
        "Find all regulatory violation reports",
        "What compliance audits are due?",
        "Show me all safety incident reports",
        "Find all environmental compliance issues",
        "What legal notices have we received?",
        "Show me all insurance policy reviews",
        "Find all risk assessment reports",
        "What compliance training is required?",
        "Show me all regulatory correspondence",
        "Find all permit violation notices",
        "What compliance certifications expire soon?",
        
        // Financial Oversight
        "Show me monthly spending by property",
        "Find all budget vs actual reports",
        "What expense categories are over budget?",
        "Show me all financial variance reports",
        "Find all cost center performance data",
        "What properties have declining margins?",
        "Show me all cash flow projections",
        "Find all accounts payable aging reports",
        "What vendors have payment disputes?",
        "Show me all financial audit findings",
        "Find all expense allocation reports",
        "What financial controls need strengthening?",
        
        // Vendor & Contract Oversight
        "Find all vendor performance reviews",
        "Show me vendor spending by category",
        "What vendors exceed spending limits?",
        "Find all vendor contract renewals",
        "Show me vendor insurance compliance",
        "What vendors have quality issues?",
        "Find all vendor dispute resolutions",
        "Show me vendor payment terms analysis",
        "What vendors offer volume discounts?",
        "Find all vendor risk assessments",
        "Show me vendor diversity reports",
        "What vendor agreements need renegotiation?",
        
        // AI & System Analytics
        "What expenses were flagged by AI?",
        "Show me AI-detected anomalies",
        "Find all system-generated alerts",
        "What patterns has AI identified?",
        "Show me predictive maintenance recommendations",
        "Find all automated expense categorizations",
        "What AI insights are available?",
        "Show me machine learning predictions",
        "Find all data quality issues",
        "What system optimizations are suggested?",
        "Show me AI performance metrics",
        "Find all automated workflow results",
        
        // Document & Data Management
        "Find all documents uploaded this week",
        "Show me document compliance status",
        "What documents are missing or incomplete?",
        "Find all document retention schedules",
        "Show me document access logs",
        "What documents need digital conversion?",
        "Find all document approval workflows",
        "Show me document version control issues",
        "What documents have security restrictions?",
        "Find all document backup statuses",
        "Show me document search analytics",
        "What documents are frequently accessed?",
        
        // Operational Efficiency
        "What are the most common repair types?",
        "Show me operational efficiency metrics",
        "Find all process improvement opportunities",
        "What workflows need optimization?",
        "Show me resource utilization reports",
        "Find all bottleneck analyses",
        "What best practices should be standardized?",
        "Show me cross-property comparisons",
        "Find all efficiency benchmark reports",
        "What automation opportunities exist?",
        "Show me staff productivity metrics",
        "Find all operational cost savings",
        
        // Strategic Planning
        "Show me 5-year maintenance projections",
        "Find all capital planning documents",
        "What strategic initiatives are active?",
        "Show me market analysis reports",
        "Find all competitive analysis data",
        "What expansion opportunities exist?",
        "Show me portfolio optimization studies",
        "Find all investment analysis reports",
        "What strategic partnerships are available?",
        "Show me long-term budget forecasts",
        "Find all scenario planning documents",
        "What strategic risks need mitigation?",
        
        // Quality Assurance
        "Show me all quality control reports",
        "Find all customer satisfaction surveys",
        "What quality issues are recurring?",
        "Show me service level agreement compliance",
        "Find all quality improvement initiatives",
        "What quality metrics are declining?",
        "Show me all quality audit results",
        "Find all corrective action plans",
        "What quality training is needed?",
        "Show me quality benchmark comparisons",
        "Find all quality certification documents",
        "What quality standards need updating?",
        
        // Emergency Management
        "Show me all emergency response plans",
        "Find all emergency contact directories",
        "What emergency procedures need updating?",
        "Show me emergency preparedness reports",
        "Find all disaster recovery plans",
        "What emergency equipment needs inspection?",
        "Show me emergency communication logs",
        "Find all emergency training records",
        "What emergency scenarios need planning?",
        "Show me emergency response metrics",
        "Find all emergency vendor agreements",
        "What emergency protocols need revision?",
        
        // Technology & Innovation
        "Show me all technology upgrade plans",
        "Find all digital transformation initiatives",
        "What technology investments are planned?",
        "Show me system integration reports",
        "Find all software licensing agreements",
        "What technology training is required?",
        "Show me cybersecurity assessment reports",
        "Find all data migration plans",
        "What technology partnerships exist?",
        "Show me innovation pilot programs",
        "Find all technology performance metrics",
        "What emerging technologies should we consider?"
      ]
    };

    const currentSuggestions = roleSuggestions[role as keyof typeof roleSuggestions] || roleSuggestions.pm;
    
    if (!query.trim()) {
      return currentSuggestions.slice(0, 5);
    }
    
    return currentSuggestions.filter(suggestion => 
      suggestion.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
  };

  const handleAiSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setAiSearchLoading(true);
    setShowAiSuggestions(false);
    
    // Simulate AI search processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock AI search results based on query
    const mockResults = generateMockAiResults(query);
    setAiSearchResults(mockResults);
    setAiSearchLoading(false);
  };

  const generateMockAiResults = (query: string) => {
    const queryLower = query.toLowerCase();
    
    // Mock AI reasoning and document matching
    if (queryLower.includes('hvac') || queryLower.includes('heating') || queryLower.includes('cooling')) {
      return {
        summary: "Found 8 HVAC-related documents totaling $12,450 in expenses across 3 properties. The most recent service was a $3,200 repair at Stanford GSB on December 15th.",
        documents: collateralDocuments.filter(doc => 
          doc.filename.toLowerCase().includes('hvac') || 
          doc.tags.some(tag => tag.toLowerCase().includes('hvac'))
        ).slice(0, 4),
        insights: [
          "Stanford GSB has the highest HVAC maintenance costs ($8,200 YTD)",
          "Most common issue: Filter replacements and duct cleaning",
          "Average cost per HVAC service: $1,556"
        ]
      };
    }
    
    if (queryLower.includes('mold') || queryLower.includes('inspection')) {
      return {
        summary: "Found 3 inspection reports mentioning mold concerns. Two properties require immediate attention based on recent findings.",
        documents: collateralDocuments.filter(doc => 
          doc.documentType === 'compliance_doc' || 
          doc.tags.some(tag => tag.toLowerCase().includes('mold'))
        ).slice(0, 3),
        insights: [
          "Sunnyvale 432 - Mold detected in basement (requires remediation)",
          "Stanford GSB - Minor mold concerns in bathroom (resolved)",
          "Menlo Park - Preventive inspection scheduled for next month"
        ]
      };
    }
    
    if (queryLower.includes('overcharged') || queryLower.includes('expensive') || queryLower.includes('cost')) {
      return {
        summary: "Identified 5 potentially overcharged transactions totaling $2,340. Analysis shows 3 vendors with pricing above market average.",
        documents: collateralDocuments.filter(doc => 
          doc.amount && doc.amount > 1000
        ).slice(0, 5),
        insights: [
          "Home Depot charges 15% above average for similar services",
          "Plumbing services at Stanford GSB were 23% higher than typical",
          "Consider negotiating bulk rates with frequent vendors"
        ]
      };
    }
    
    // Default search results
    return {
      summary: `Found ${Math.floor(Math.random() * 12) + 3} documents related to "${query}". Results include receipts, contracts, and inspection reports.`,
      documents: collateralDocuments.slice(0, Math.floor(Math.random() * 6) + 2),
      insights: [
        "Most documents are from the last 6 months",
        "Average document value: $1,234",
        "All required compliance documents are current"
      ]
    };
  };

  const handleAskAi = async (message: string) => {
    if (!message.trim()) return;
    
    const newUserMessage = { role: 'user' as const, content: message };
    setAiChatMessages(prev => [...prev, newUserMessage]);
    setAiChatInput('');
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const aiResponse = generateAiChatResponse(message);
    setAiChatMessages(prev => [...prev, aiResponse]);
  };

  const generateAiChatResponse = (message: string) => {
    const messageLower = message.toLowerCase();
    
    if (messageLower.includes('spend') || messageLower.includes('cost') || messageLower.includes('money')) {
      return {
        role: 'assistant' as const,
        content: "Based on your collateral documents, here's a breakdown of spending:\n\n• Total documented expenses: $45,230\n• Highest category: HVAC maintenance ($12,450)\n• Most active property: Stanford GSB\n• Average monthly spend: $7,538\n\nWould you like me to break this down by property or time period?",
        documents: collateralDocuments.filter(doc => doc.amount && doc.amount > 500).slice(0, 3)
      };
    }
    
    if (messageLower.includes('mold') || messageLower.includes('inspection')) {
      return {
        role: 'assistant' as const,
        content: "I found several inspection reports in your documents:\n\n• 2 properties have mold-related findings\n• 1 requires immediate remediation\n• 3 preventive inspections scheduled\n\nThe most critical issue is at Sunnyvale 432 where basement mold was detected. I recommend prioritizing this repair.",
        documents: collateralDocuments.filter(doc => doc.documentType === 'compliance_doc').slice(0, 2)
      };
    }
    
    return {
      role: 'assistant' as const,
      content: `I understand you're asking about "${message}". Based on your document collection, I can help you find relevant information. Let me search through your receipts, contracts, and reports to provide specific insights.\n\nWhat specific aspect would you like me to focus on?`,
      documents: collateralDocuments.slice(0, 2)
    };
  };

  // Keyboard shortcuts for AI search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // CMD+K or Ctrl+K to focus AI search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (activeTab === 'collateral') {
          const searchInput = document.querySelector('[placeholder*="Ask anything"]') as HTMLInputElement;
          if (searchInput) {
            searchInput.focus();
          }
        } else {
          setActiveTab('collateral');
          setTimeout(() => {
            const searchInput = document.querySelector('[placeholder*="Ask anything"]') as HTMLInputElement;
            if (searchInput) {
              searchInput.focus();
            }
          }, 100);
        }
      }
      // CMD+Shift+K or Ctrl+Shift+K to open Ask AI modal
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'K') {
        e.preventDefault();
        setAskAiModalOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Role Toggle for Demo */}
      <div className="flex justify-end p-4 bg-gray-900 border-b border-gray-800">
        <span className="mr-2 text-gray-400">Role:</span>
        <Button
          size="sm"
          className={role === 'pm' ? 'bg-blue-600 text-white mr-2' : 'border-blue-600 text-blue-400 mr-2'}
          variant={role === 'pm' ? 'default' : 'outline'}
          onClick={() => { 
            setRole('pm'); 
            setActiveTab('dashboard'); 
            localStorage.setItem('currentRole', 'pm');
          }}
        >
          Property Manager
        </Button>
        <Button
          size="sm"
          className={role === 'technician' ? 'bg-blue-600 text-white mr-2' : 'border-blue-600 text-blue-400 mr-2'}
          variant={role === 'technician' ? 'default' : 'outline'}
          onClick={() => { 
            setRole('technician'); 
            setActiveTab('dashboard'); 
            localStorage.setItem('currentRole', 'technician');
          }}
        >
          Technician
        </Button>
        <Button
          size="sm"
          className={role === 'centralOffice' ? 'bg-blue-600 text-white' : 'border-blue-600 text-blue-400'}
          variant={role === 'centralOffice' ? 'default' : 'outline'}
          onClick={() => { 
            setRole('centralOffice'); 
            setActiveTab('dashboard'); 
            localStorage.setItem('currentRole', 'centralOffice');
          }}
        >
          Central Office
        </Button>
      </div>
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <div className="w-64 bg-gray-900 border-r border-gray-800 p-4">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Job Vault</h1>
          </div>
          <nav className="space-y-1">
            {sidebarTabs.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  activeTab === item.id ? "bg-gray-800 text-white" : "hover:bg-gray-800 text-gray-300 hover:text-white",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="mt-8 pt-8 border-t border-gray-800">
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white">
                <Database className="h-4 w-4 mr-2" />
                Sync All
              </Button>
              <Button variant="outline" className="w-full justify-start bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="px-6 py-4">
            <div className="flex items-center justify-between">
                {/* Remove QuickBooks Ready badge and Export All button */}
          </div>
        </div>
      </header>
          <div className="p-6">
            {/* Main content area controlled by activeTab */}
            {activeTab === "dashboard" && (
              <>
                {/* Dashboard Summary Section */}
                <div className="mb-6 p-6 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-600 rounded-xl shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Welcome back!</h2>
                    <p className="text-blue-200 text-lg">
                      {role === 'technician' ? (
                        <>
                          You have <span className="font-semibold text-blue-300">{technicianOpenJobs.length}</span> open work orders, <span className="font-semibold text-blue-200">{technicianInProgressJobs.length}</span> in progress, <span className="font-semibold text-blue-100">{technicianFinishedJobs.length}</span> finished, and <span className="font-semibold text-blue-100">${technicianTotalSpend.toLocaleString(undefined, {minimumFractionDigits:2})}</span> spent this month.
                        </>
                      ) : (
                        <>
                          You have <span className="font-semibold text-blue-300">{openJobs.length}</span> open work orders, <span className="font-semibold text-blue-200">{pendingOwnerApprovals.length}</span> pending owner approvals, and <span className="font-semibold text-blue-100">${totalSpend.toLocaleString(undefined, {minimumFractionDigits:2})}</span> spent this month.
                        </>
                      )}
                    </p>
                    <p className="text-blue-300 mt-2 text-sm">
                      {role === 'technician' 
                        ? "Keep track of your assigned work orders and expenses for efficient project management."
                        : "Keep an eye on overdue work orders and uncategorized expenses for a healthy workflow."
                      }
                    </p>
                  </div>
                  {/* Removed badges for Open Jobs, Pending Approvals, This Month */}
                </div>
                {/* Job Status Overview KPIs */}
                <div className="mb-2 mt-2">
                  <h4 className="text-lg font-semibold text-white mb-2">
                    {role === 'technician' ? 'My Work Order Status Overview' : 'Work Order Status Overview'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="text-gray-400 text-xs mb-1">
                          {role === 'technician' ? 'Open Work Orders' : 'Open Work Orders'}
                        </div>
                        <div className="text-3xl font-bold text-white">
                          {role === 'technician' ? technicianOpenJobs.length : openJobs.length}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="text-gray-400 text-xs mb-1">
                          {role === 'technician' ? 'In Progress' : 'Pending Owner Approvals'}
                        </div>
                        <div className="text-3xl font-bold text-yellow-400">
                          {role === 'technician' ? technicianInProgressJobs.length : pendingOwnerApprovals.length}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="text-gray-400 text-xs mb-1">
                          {role === 'technician' ? 'Finished' : 'Work Orders Assigned to Subs'}
                        </div>
                        <div className="text-3xl font-bold text-blue-400">
                          {role === 'technician' ? technicianFinishedJobs.length : jobsAssignedToSubs.length}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="text-gray-400 text-xs mb-1">
                          {role === 'technician' ? 'Overdue' : 'Overdue Work Orders'}
                        </div>
                        <div className="text-3xl font-bold text-red-400">
                          {role === 'technician' ? technicianOverdueJobs.length : overdueJobs.length}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                {/* Expenses This Month KPIs */}
                <div className="mb-2 mt-8">
                  <h4 className="text-lg font-semibold text-white mb-2">
                    {role === 'technician' ? 'My Expenses This Month' : 'Expenses This Month'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="text-gray-400 text-xs mb-1">Total Spend</div>
                        <div className="text-3xl font-bold text-white">
                          ${role === 'technician' ? technicianTotalSpend.toLocaleString(undefined, {minimumFractionDigits:2}) : totalSpend.toLocaleString(undefined, {minimumFractionDigits:2})}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="text-gray-400 text-xs mb-1">Billable</div>
                        <div className="text-3xl font-bold text-green-400">
                          ${role === 'technician' ? technicianBillableSpend.toLocaleString(undefined, {minimumFractionDigits:2}) : billableSpend.toLocaleString(undefined, {minimumFractionDigits:2})}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="text-gray-400 text-xs mb-1">Non-Billable</div>
                        <div className="text-3xl font-bold text-gray-400">
                          ${role === 'technician' ? technicianNonBillableSpend.toLocaleString(undefined, {minimumFractionDigits:2}) : nonBillableSpend.toLocaleString(undefined, {minimumFractionDigits:2})}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="text-gray-400 text-xs mb-1">Uncategorized / Needs Review</div>
                        <div className="text-3xl font-bold text-yellow-400">
                          ${role === 'technician' ? technicianUncategorizedSpend.toLocaleString(undefined, {minimumFractionDigits:2}) : uncategorizedSpend.toLocaleString(undefined, {minimumFractionDigits:2})}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                {/* Reimbursement Overview - Central Office Only */}
                {role === 'centralOffice' && (
                  <div className="mb-2 mt-8">
                    <h4 className="text-lg font-semibold text-white mb-2">Reimbursement Overview</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                      <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-4">
                          <div className="text-gray-400 text-xs mb-1">Total Expense Spend</div>
                          <div className="text-3xl font-bold text-white">
                            ${totalSpend.toLocaleString(undefined, {minimumFractionDigits:2})}
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-4">
                          <div className="text-gray-400 text-xs mb-1">Reimbursed</div>
                          <div className="text-3xl font-bold text-green-400">
                            ${reconciledSpend.toLocaleString(undefined, {minimumFractionDigits:2})}
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-4">
                          <div className="text-gray-400 text-xs mb-1">Awaiting Reimbursement</div>
                          <div className="text-3xl font-bold text-yellow-400">
                            ${pendingBillableSpend.toLocaleString(undefined, {minimumFractionDigits:2})}
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-4">
                          <div className="text-gray-400 text-xs mb-1">Issues / Needs Review</div>
                          <div className="text-3xl font-bold text-red-400">
                            ${issuesSpend.toLocaleString(undefined, {minimumFractionDigits:2})}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
                {/* Recent Activity Notifications */}
                <div className="mb-2 mt-8">
                  <h4 className="text-lg font-semibold text-white mb-2">
                    {role === 'technician' ? 'My Recent Activity' : 'Recent Activity'}
                  </h4>
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Mock recent activity notifications */}
                        {role === 'technician' ? (
                          <>
                            {/* Technician-specific activities */}
                            <div className="flex items-start space-x-3 p-3 bg-gray-900 rounded-lg border-l-4 border-blue-500">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                  <FileText className="h-4 w-4 text-white" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white font-medium">Work order assigned to you</p>
                                <p className="text-xs text-gray-400">HVAC System Maintenance - Annual Service at Stanford GSB</p>
                                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3 p-3 bg-gray-900 rounded-lg border-l-4 border-green-500">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                                  <CheckCircle className="h-4 w-4 text-white" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white font-medium">Work order completed</p>
                                <p className="text-xs text-gray-400">Lobby Painting at Downtown Lofts finished by you</p>
                                <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3 p-3 bg-gray-900 rounded-lg border-l-4 border-purple-500">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                                  <DollarSign className="h-4 w-4 text-white" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white font-medium">Expense recorded</p>
                                <p className="text-xs text-gray-400">$120.50 spent at Home Depot for HVAC parts</p>
                                <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3 p-3 bg-gray-900 rounded-lg border-l-4 border-yellow-500">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                                  <Clock className="h-4 w-4 text-white" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white font-medium">Work order in progress</p>
                                <p className="text-xs text-gray-400">Kitchen Renovation at Stanford GSB - Started work</p>
                                <p className="text-xs text-gray-500 mt-1">2 days ago</p>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            {/* PM/Central Office activities */}
                            <div className="flex items-start space-x-3 p-3 bg-gray-900 rounded-lg border-l-4 border-blue-500">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                  <FileText className="h-4 w-4 text-white" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white font-medium">New work order created</p>
                                <p className="text-xs text-gray-400">HVAC System Maintenance - Annual Service at Stanford GSB</p>
                                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3 p-3 bg-gray-900 rounded-lg border-l-4 border-yellow-500">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                                  <AlertCircle className="h-4 w-4 text-white" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white font-medium">Approval required</p>
                                <p className="text-xs text-gray-400">Emergency Plumbing Repair at Sunnyvale 432 needs owner approval</p>
                                <p className="text-xs text-gray-500 mt-1">4 hours ago</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3 p-3 bg-gray-900 rounded-lg border-l-4 border-green-500">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                                  <CheckCircle className="h-4 w-4 text-white" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white font-medium">Work order completed</p>
                                <p className="text-xs text-gray-400">Lobby Painting at Downtown Lofts finished by Alice Johnson</p>
                                <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3 p-3 bg-gray-900 rounded-lg border-l-4 border-purple-500">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                                  <DollarSign className="h-4 w-4 text-white" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white font-medium">Expense recorded</p>
                                <p className="text-xs text-gray-400">$150.00 spent at Home Depot for HVAC parts</p>
                                <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3 p-3 bg-gray-900 rounded-lg border-l-4 border-red-500">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                                  <Clock className="h-4 w-4 text-white" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white font-medium">Overdue work order</p>
                                <p className="text-xs text-gray-400">Kitchen Renovation at Stanford GSB is 3 days overdue</p>
                                <p className="text-xs text-gray-500 mt-1">2 days ago</p>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
            {activeTab === "workorders" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-white">Work Orders</h3>
                  {(role === 'pm' || role === 'centralOffice') && (
                    <div className="flex gap-2">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setImportAppFolioDialogOpen(true)}>
                        <Sync className="h-4 w-4 mr-2" /> Appfolio Sync
                      </Button>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setNewJobDialogOpen(true)}>New Work Order</Button>
                    </div>
                  )}
                </div>
                <div className="flex flex-col h-[400px] rounded-lg mb-8">
                  <div className="flex-1 overflow-x-auto overflow-y-auto">
                    {/* Jobs table moved here from Dashboard */}
                    <TooltipProvider>
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="bg-gray-900 border-b border-gray-700">
                            <th className="text-left py-3 px-4 min-w-[160px] font-semibold text-white">Property</th>
                            <th className="text-left py-3 px-4 min-w-[240px] font-semibold text-white">Name</th>
                            <th className="text-left py-3 px-4 min-w-[180px] font-semibold text-white">Approval</th>
                            <th className="text-left py-3 px-4 min-w-[140px] font-semibold text-white">Technician</th>
                            <th className="text-left py-3 px-4 min-w-[120px] font-semibold text-white">Requested</th>
                            <th className="text-center py-3 px-4 min-w-[100px] font-semibold text-white">Priority</th>
                            <th className="text-left py-3 px-4 min-w-[120px] font-semibold text-white">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(role === 'technician'
                            ? jobs.filter((job) => job.technician === technicianName)
                            : jobs
                          ).map((job) => (
                            <React.Fragment key={job.id}>
                              <tr
                                className="group bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer"
                                onClick={() => { router.push(`/workorders/${job.id}?role=${role}`); }}
                              >
                                <td className="py-3 px-4">
                                  <div className="font-medium text-white" title={job.property}>
                                    {job.property}
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="text-gray-200" title={job.description}>
                                    {job.description.charAt(0).toUpperCase() + job.description.slice(1)}
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    {/* Approval Status Pill System */}
                                    {job.preApprovalStatus === 'Approved' ? (
                                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-700 text-green-100">
                                        <CheckCircle className="h-4 w-4 mr-1 text-green-200" /> Approved
                                      </span>
                                    ) : job.preApprovalStatus === 'Required' && approvalJobs[job.id]?.status === 'No Response' ? (
                                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-600 text-yellow-100">
                                        <Clock className="h-4 w-4 mr-1 text-yellow-200" /> Approval Requested
                                      </span>
                                    ) : job.preApprovalStatus === 'Required' ? (
                                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-700 text-red-100">
                                        <AlertCircle className="h-4 w-4 mr-1 text-red-200" /> Approval Needed
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-700 text-gray-200">
                                        <Settings className="h-4 w-4 mr-1 text-gray-300" /> Automatic Approval
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="text-gray-300" title={job.technician || 'Unassigned'}>
                                    {job.technician || 'Unassigned'}
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-gray-300">
                                  {job.requested}
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <span className="flex justify-center items-center">
                                          {(() => {
                                            switch (job.priority) {
                                              case 'High':
                                                return <span className="inline-block w-4 h-4 rounded-full bg-red-500" />;
                                              case 'Medium':
                                                return <span className="inline-block w-4 h-4 rounded-full bg-orange-400" />;
                                              case 'Low':
                                                return <span className="inline-block w-4 h-4 rounded-full bg-blue-400" />;
                                              default:
                                                return <span className="inline-block w-4 h-4 rounded-full bg-gray-400" />;
                                            }
                                          })()}
                                        </span>
                                      </TooltipTrigger>
                                      <TooltipContent>{job.priority || '-'}</TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    {(role === 'pm' || role === 'centralOffice') && (
                                      <>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              size="icon"
                                              variant="ghost"
                                              className="h-8 w-8 text-gray-300 hover:text-red-300 hover:bg-red-500/20"
                                              onClick={e => { e.stopPropagation(); setJobToDelete(job); setDeleteDialogOpen(true); }}
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>Delete job</TooltipContent>
                                        </Tooltip>
                                      </>
                                    )}
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          className="h-8 w-8 text-gray-300 hover:text-white hover:bg-green-500/20"
                                          onClick={e => { 
                                            e.stopPropagation(); 
                                            setExpandedJobExpenses(expandedJobExpenses === job.id ? null : job.id); 
                                          }}
                                        >
                                          <Eye className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        {expandedJobExpenses === job.id ? 'Hide Expenses' : 'View Expenses'}
                                      </TooltipContent>
                                    </Tooltip>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className={`text-blue-400 hover:text-blue-600`}
                                      onClick={() => { router.push(`/workorders/${job.id}?role=${role}`); }}
                                      aria-label="View Work Order Details"
                                    >
                                      <ChevronRight className="h-5 w-5 transition-transform" />
                                    </Button>
                                  </div>
                                  {/* Separate Send Reminder button for jobs waiting for approval */}
                                  {(role === 'pm' || role === 'centralOffice') && approvalJobs[job.id]?.status === 'No Response' && (
                                    <div className="mt-2">
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-blue-400 border-blue-700 hover:bg-blue-700/20"
                                          >
                                            <MessageSquare className="h-4 w-4 mr-1" />
                                            Send Reminder
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Send reminder to owner</TooltipContent>
                                      </Tooltip>
                                    </div>
                                  )}
                                </td>
                              </tr>
                              {/* Expanded expenses row */}
                              {expandedJobExpenses === job.id && (
                                <tr className="bg-gray-900">
                                  <td colSpan={8} className="p-0">
                                    <div className="p-4">
                                      <h5 className="text-sm font-semibold text-white mb-2">Expenses for this job</h5>
                                      <div className="overflow-x-auto">
                                        <table className="min-w-full text-xs mb-2">
                                          <thead>
                                            <tr className="border-b border-gray-700">
                                              <th className="text-left py-2 px-3 font-semibold text-white">Date</th>
                                              <th className="text-left py-2 px-3 font-semibold text-white">Vendor</th>
                                              <th className="text-left py-2 px-3 font-semibold text-white">Made By</th>
                                              <th className="text-left py-2 px-3 font-semibold text-white">Amount</th>
                                              <th className="text-left py-2 px-3 font-semibold text-white">Memo</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {filterExpensesByRole([...transactions, ...technicianTransactions])
                                              .filter(txn => txn.jobId === job.id)
                                              .map((txn) => {
                                                return (
                                                  <tr key={txn.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700">
                                                    <td className="py-2 px-3 text-left text-gray-300">{txn.date}</td>
                                                    <td className="py-2 px-3 text-left text-gray-300">{txn.vendor}</td>
                                                    <td className="py-2 px-3 text-left text-gray-300">{txn.madeBy}</td>
                                                    <td className="py-2 px-3 text-left text-gray-300">${txn.amount.toFixed(2)}</td>
                                                    <td className="py-2 px-3 text-left text-gray-300">{txn.memo || '-'}</td>
                                                  </tr>
                                                );
                                              })}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </TooltipProvider>
                  </div>
                </div>
              </>
            )}
            {activeTab === "activity" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-white">Activity Log</h3>
                        </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-4 items-end">
                  <div>
                    <Label className="text-gray-300">Property</Label>
                    <Select value={activityPropertyFilter} onValueChange={setActivityPropertyFilter}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-40">
                        <SelectValue>{activityPropertyFilter === 'all' ? 'All Properties' : activityPropertyFilter}</SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="all">All Properties</SelectItem>
                        {properties.map(property => (
                          <SelectItem key={property.id} value={property.name}>{property.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                            </div>
                  <div>
                    <Label className="text-gray-300">Work Order</Label>
                    <Select value={activityJobFilter} onValueChange={setActivityJobFilter}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-40">
                        <SelectValue>{activityJobFilter === 'all' ? 'All Work Orders' : activityJobFilter}</SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="all">All Work Orders</SelectItem>
                        {jobs.map(job => (
                          <SelectItem key={job.id} value={job.description}>{job.description}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                            </div>
                  <div>
                    <Label className="text-gray-300">Activity</Label>
                    <Select value={activityMilestoneFilter} onValueChange={setActivityMilestoneFilter}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-40">
                        <SelectValue>{activityMilestoneFilter === 'all' ? 'All Activities' : activityMilestoneFilter}</SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="all">All Activities</SelectItem>
                        {activityMilestonesWithUpdate.map(milestone => (
                          <SelectItem key={milestone.milestone} value={milestone.milestone}>{milestone.milestone}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                            </div>
                  <div>
                    <Label className="text-gray-300">Owner</Label>
                    <Select value={activityOwnerFilter} onValueChange={setActivityOwnerFilter}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-32">
                        <SelectValue>{activityOwnerFilter === 'all' ? 'All Owners' : activityOwnerFilter}</SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="all">All Owners</SelectItem>
                        <SelectItem value="PM">PM</SelectItem>
                        <SelectItem value="Technician">Technician</SelectItem>
                        <SelectItem value="Central Office">Central Office</SelectItem>
                      </SelectContent>
                    </Select>
                            </div>
                        </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-gray-900 border-b border-gray-700">
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
                        // Generate activity data from jobs and milestones
                        const activities = jobs.flatMap(job => 
                          activityMilestonesWithUpdate.map(milestone => ({
                            ...milestone,
                            job,
                            date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                            fileKey: `${job.id}-${milestone.milestone.toLowerCase().replace(/\s+/g, '-')}`
                          }))
                        );

                        // Apply filters
                        return activities
                          .filter(activity => {
                            if (activityPropertyFilter !== 'all' && activity.job.property !== activityPropertyFilter) return false;
                            if (activityJobFilter !== 'all' && activity.job.description !== activityJobFilter) return false;
                            if (activityMilestoneFilter !== 'all' && activity.milestone !== activityMilestoneFilter) return false;
                            if (activityOwnerFilter !== 'all' && activity.owner !== activityOwnerFilter) return false;
                            return true;
                          })
                          .map((activity, i) => (
                            <tr key={activity.milestone + i} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                              <td className="py-3 px-4 text-gray-300">{activity.job.property}</td>
                              <td className="py-3 px-4 text-gray-300">{activity.job.description}</td>
                              <td className="py-3 px-4 text-gray-300">{activity.milestone}</td>
                              <td className="py-3 px-4 text-gray-300">
                                <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${
                                  activity.owner === 'PM' ? 'bg-blue-700 text-blue-100' :
                                  activity.owner === 'Technician' ? 'bg-green-700 text-green-100' :
                                  'bg-purple-700 text-purple-100'
                                }`}>
                                  {activity.owner}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-gray-300">{activity.date}</td>
                              <td className="py-3 px-4 text-gray-300">
                                {activityFiles[activity.fileKey]?.length > 0 ? (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-blue-400 hover:text-blue-300 p-0 h-auto"
                                    onClick={() => {
                                      // Mock file preview - in real app this would show actual files
                                      alert(`Viewing files for ${activity.milestone}`);
                                    }}
                                  >
                                    <Eye className="h-3 w-3" />
                            </Button>
                                ) : '-'}
                              </td>
                            </tr>
                          ));
                      })()}
                    </tbody>
                  </table>
                          </div>
              </>
            )}
            {activeTab === "payments" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-white">Trust Account Reimbursements</h3>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-400">
                      Manage reimbursements for logged transactions by work order
                    </div>
                    <Button 
                      onClick={() => setMonthlyReportDialogOpen(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      size="sm"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Monthly Reports
                    </Button>
                  </div>
                </div>

                {/* Enhanced Trust Account Summary */}
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-white mb-3">Trust Account Balances & Auto-Mapping</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {properties.map((property) => {
                      const ytdSpending = getPropertyYTDSpending(property.name);
                      return (
                        <Card key={property.id} className="bg-gray-800 border-gray-700">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div className="text-sm font-medium text-white">{property.name}</div>
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                <span className="text-xs text-green-400">Auto-mapped</span>
                              </div>
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">
                              ${property.trustBalance.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-400 mb-2">
                              Trust Balance • {property.trustAccount.bankName}
                            </div>
                            <div className="text-xs text-gray-500 mb-2">
                              Account: {property.trustAccount.accountNumber} • Routing: {property.trustAccount.routingNumber}
                            </div>
                            <div className="text-lg font-semibold text-blue-400 mb-1">
                              ${ytdSpending.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-400">
                              YTD Spending • Last sync: {property.lastSync}
                            </div>
                            <div className="text-xs text-green-400 mt-1">
                              🔄 Reimbursements auto-sync to this account
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* Outstanding Reimbursements Section */}
                <div className="mb-6 bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                  <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-yellow-400" />
                    Outstanding Reimbursements - Current Month (January 2025)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {properties.map((property) => {
                      const currentMonthPending = [...transactions, ...technicianTransactions]
                        .filter(txn => {
                          const job = jobs.find(j => j.id === txn.jobId);
                          const txnDate = new Date(txn.date);
                          return job && job.property === property.name && 
                                 txn.status === 'pending' &&
                                 txnDate.getMonth() === 0 && // January
                                 txnDate.getFullYear() === 2025;
                        })
                        .reduce((sum, txn) => sum + txn.amount, 0);
                      
                      if (currentMonthPending === 0) return null;
                      
                      return (
                        <Card key={property.id} className="bg-gray-800 border-yellow-500/30">
                          <CardContent className="p-4">
                            <div className="text-sm font-medium text-white mb-2">{property.name}</div>
                            <div className="text-xl font-bold text-yellow-400 mb-2">
                              ${currentMonthPending.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-400 mb-3">
                              Pending • Auto-maps to {property.trustAccount.bankName}
                            </div>
                            <Button 
                              onClick={() => handleMonthlyReimbursement(property, '2025-01')}
                              className="bg-green-600 hover:bg-green-700 text-white w-full"
                              size="sm"
                            >
                              <DollarSign className="h-4 w-4 mr-2" />
                              Reimburse January
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* Monthly Expense Reports */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-md font-semibold text-white">Monthly GL-Coded Expense Reports</h4>
                    <div className="text-sm text-gray-400">
                      📊 Auto-synced with AppFolio • Updated real-time
                    </div>
                  </div>
                  
                  {properties.map((property) => {
                    // Get all transactions for this property by month
                    const propertyJobs = jobs.filter(job => job.property === property.name);
                    const propertyTransactions = [...transactions, ...technicianTransactions].filter(txn => {
                      const job = jobs.find(j => j.id === txn.jobId);
                      return job && job.property === property.name;
                    });

                    // Group transactions by month (showing last 3 months)
                    const monthlyGroups = ['2025-01', '2024-12', '2024-11'].map(month => {
                      const [year, monthNum] = month.split('-').map(Number);
                      const monthTransactions = propertyTransactions.filter(txn => {
                        const txnDate = new Date(txn.date);
                        return txnDate.getFullYear() === year && txnDate.getMonth() === monthNum - 1;
                      });
                      
                      const totalAmount = monthTransactions.reduce((sum, txn) => sum + txn.amount, 0);
                      const reconciledAmount = monthTransactions.filter(txn => txn.status === 'reconciled').reduce((sum, txn) => sum + txn.amount, 0);
                      const pendingAmount = monthTransactions.filter(txn => txn.status === 'pending').reduce((sum, txn) => sum + txn.amount, 0);
                      
                      return {
                        month,
                        monthName: new Date(year, monthNum - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
                        transactions: monthTransactions,
                        totalAmount,
                        reconciledAmount,
                        pendingAmount,
                        property
                      };
                    }).filter(group => group.transactions.length > 0);

                    if (monthlyGroups.length === 0) return null;

                    return (
                      <div key={property.id} className="bg-gray-800 rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h5 className="text-lg font-semibold text-white">{property.name}</h5>
                          <div className="text-sm text-gray-400 flex items-center gap-2">
                            <span className="text-blue-400">🔄 AppFolio Sync Active</span>
                            • {monthlyGroups.length} month{monthlyGroups.length !== 1 ? 's' : ''} with expenses
                          </div>
                        </div>

                        <div className="space-y-3">
                          {monthlyGroups.map((group) => {
                            const isExpanded = expandedWorkOrders.has(group.month);
                            return (
                              <div key={group.month} className="bg-gray-700 rounded-lg border border-gray-600">
                                {/* Monthly Report Header - Always Visible */}
                                <div 
                                  className="p-4 cursor-pointer hover:bg-gray-600/50 transition-colors"
                                  onClick={() => toggleWorkOrderExpansion(group.month)}
                                >
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-3">
                                      <div className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                                        <ChevronRight className="h-4 w-4 text-gray-400" />
                                      </div>
                                      <div>
                                        <h6 className="font-medium text-white">{group.monthName} GL Report</h6>
                                        <div className="text-sm text-gray-400 flex items-center gap-2">
                                          <span className="text-blue-400">📊 AppFolio</span>
                                          • {group.transactions.length} transaction{group.transactions.length !== 1 ? 's' : ''}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                      <div className="text-right">
                                        <div className="text-lg font-bold text-white">
                                          ${group.totalAmount.toFixed(2)}
                                        </div>
                                        <div className="text-sm text-green-400">
                                          ${group.reconciledAmount.toFixed(2)} reconciled
                                        </div>
                                        {group.pendingAmount > 0 && (
                                          <div className="text-sm text-yellow-400">
                                            ${group.pendingAmount.toFixed(2)} pending
                                          </div>
                                        )}
                                      </div>
                                      <Button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleMonthlyReimbursement(group.property, group.month);
                                        }}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        size="sm"
                                        disabled={group.pendingAmount === 0}
                                      >
                                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                                        Process GL Report
                                      </Button>
                                    </div>
                                  </div>
                                </div>

                                {/* Collapsible GL Report Section */}
                                {isExpanded && (
                                  <div className="border-t border-gray-600 p-4 bg-gray-800/50">
                                    <div className="mb-3 flex justify-between items-center">
                                      <h6 className="text-sm font-medium text-gray-300">GL-Coded Expense Report</h6>
                                      <div className="text-xs text-blue-400">Auto-synced with AppFolio</div>
                                    </div>
                                    <div className="overflow-x-auto">
                                      <TooltipProvider>
                                        <table className="w-full text-sm min-w-[800px]">
                                          <thead>
                                            <tr className="border-b border-gray-600">
                                              <th className="text-left py-2 text-gray-400">Date</th>
                                              <th className="text-left py-2 text-gray-400">Merchant</th>
                                              <th className="text-left py-2 text-gray-400">GL Code</th>
                                              <th className="text-left py-2 text-gray-400">Property Code</th>
                                              <th className="text-left py-2 text-gray-400">Billable?</th>
                                              <th className="text-left py-2 text-gray-400">
                                                <Tooltip>
                                                  <TooltipTrigger asChild>
                                                    <span className="cursor-help">
                                                      Flag spend
                                                    </span>
                                                  </TooltipTrigger>
                                                  <TooltipContent>
                                                    <div>
                                                      <div className="text-sm font-semibold">Auto-flagged spend that triggered owner's approval threshold</div>
                                                      <div className="text-xs text-gray-400">
                                                        Expenses over $500 require pre-approval
                                                      </div>
                                                    </div>
                                                  </TooltipContent>
                                                </Tooltip>
                                              </th>
                                              <th className="text-left py-2 text-gray-400">Memo / Notes</th>
                                              <th className="text-left py-2 text-gray-400">Receipt</th>
                                              <th className="text-right py-2 text-gray-400">Amount</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {group.transactions.map((txn, idx) => {
                                              const job = jobs.find(j => j.id === txn.jobId);
                                              const glCode = txn.billable ? '7200 - Repairs & Maintenance' : '6100 - Office Expenses';
                                              const propertyCode = property.id.toUpperCase();
                                              
                                              // Demo flagging logic - flag specific items for demo purposes
                                              const shouldBeFlagged = txn.amount >= 120 || txn.vendor === 'Home Depot' || (txn.memo && txn.memo.includes('HVAC'));
                                              
                                              return (
                                                <tr key={idx} className="border-b border-gray-600/50">
                                                  <td className="py-2 px-3 text-gray-300">{txn.date}</td>
                                                  <td className="py-2 px-3 text-gray-300">{txn.vendor}</td>
                                                  <td className="py-2 px-3 text-blue-300">{glCode}</td>
                                                  <td className="py-2 px-3 text-blue-300">{propertyCode}</td>
                                                  <td className="py-2 px-3">
                                                    <Badge className={txn.billable ? "bg-green-600 text-white text-xs" : "bg-gray-600 text-white text-xs"}>
                                                      {txn.billable ? 'Yes' : 'No'}
                                                    </Badge>
                                                  </td>
                                                  <td className="py-2 px-3">
                                                    <Tooltip>
                                                      <TooltipTrigger asChild>
                                                        <span className="cursor-help">
                                                          {shouldBeFlagged ? (
                                                            <Badge className="bg-orange-700 text-orange-100 text-xs flex items-center gap-1">
                                                              <AlertTriangle className="h-4 w-4" />
                                                              Flagged
                                                            </Badge>
                                                          ) : (
                                                            <Badge className="bg-gray-700 text-gray-300 text-xs flex items-center gap-1">
                                                              <CheckCircle className="h-4 w-4" />
                                                              Clear
                                                            </Badge>
                                                          )}
                                                        </span>
                                                      </TooltipTrigger>
                                                      <TooltipContent>
                                                        {shouldBeFlagged ? (
                                                          <div>
                                                            <div className="text-sm font-semibold">Amount exceeds $500 threshold - requires owner approval</div>
                                                            <div className="text-xs text-gray-400">
                                                              {txn.amount >= 120 ? 'Amount exceeds $120 threshold' : ''}
                                                              {txn.vendor === 'Home Depot' ? 'High-spend vendor flagged' : ''}
                                                              {txn.memo && txn.memo.includes('HVAC') ? 'HVAC expenses require approval' : ''}
                                                            </div>
                                                          </div>
                                                        ) : (
                                                          <div className="text-sm">No flags - approved for processing</div>
                                                        )}
                                                      </TooltipContent>
                                                    </Tooltip>
                                                  </td>
                                                  <td className="py-2 px-3 text-gray-300">{txn.memo || job?.description || 'N/A'}</td>
                                                  <td className="py-2 px-3">
                                                    {txn.receipt ? (
                                                      <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300 p-0 h-auto">
                                                        [View]
                                                      </Button>
                                                    ) : (
                                                      <span className="text-gray-500">Missing</span>
                                                    )}
                                                  </td>
                                                  <td className="py-2 px-3 text-right text-gray-300">${txn.amount.toFixed(2)}</td>
                                                </tr>
                                              );
                                            })}
                                          </tbody>
                                        </table>
                                      </TooltipProvider>
                                    </div>
                                    <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded">
                                      <div className="text-sm text-blue-300 flex items-center gap-2">
                                        <span className="text-blue-400">🏦</span>
                                        Trust Account: {property.trustAccount.bankName} {property.trustAccount.accountNumber}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Monthly Report Dialog */}
                <Dialog open={monthlyReportDialogOpen} onOpenChange={setMonthlyReportDialogOpen}>
                  <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Monthly Spending Report</DialogTitle>
                      <DialogDescription>
                        Generate detailed monthly spending reports for properties
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6">
                      {/* Property and Month Selection */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="report-property" className="text-sm text-gray-400">
                            Property
                          </Label>
                          <Select 
                            value={selectedReportProperty?.id || ''} 
                            onValueChange={(value) => {
                              const property = properties.find(p => p.id === value);
                              setSelectedReportProperty(property || null);
                            }}
                          >
                            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                              <SelectValue placeholder="Select a property" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 border-gray-700 text-white">
                              {properties.map(property => (
                                <SelectItem key={property.id} value={property.id} className="bg-gray-900 text-white">
                                  {property.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="report-month" className="text-sm text-gray-400">
                            Month
                          </Label>
                          <Input
                            id="report-month"
                            type="month"
                            value={reportMonth}
                            onChange={(e) => setReportMonth(e.target.value)}
                            className="bg-gray-800 border-gray-600 text-white"
                          />
                        </div>
                      </div>

                      {/* Report Preview */}
                      {selectedReportProperty && (
                        <div className="space-y-4">
                          <div className="bg-gray-800 p-4 rounded-lg">
                            <h4 className="text-lg font-semibold text-white mb-3">
                              Report Preview - {selectedReportProperty.name} ({reportMonth})
                            </h4>
                            
                            {(() => {
                              const reportData = generateMonthlyReportData(selectedReportProperty, reportMonth);
                              const { summary, workOrderGroups } = reportData;
                              
                              return (
                                <div className="space-y-4">
                                  {/* Summary Cards */}
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <Card className="bg-gray-700 border-gray-600">
                                      <CardContent className="p-3">
                                        <div className="text-xs text-gray-400">Total Spend</div>
                                        <div className="text-lg font-bold text-white">${summary.totalSpend.toFixed(2)}</div>
                                      </CardContent>
                                    </Card>
                                    <Card className="bg-gray-700 border-gray-600">
                                      <CardContent className="p-3">
                                        <div className="text-xs text-gray-400">Billable</div>
                                        <div className="text-lg font-bold text-green-400">${summary.billableSpend.toFixed(2)}</div>
                                      </CardContent>
                                    </Card>
                                    <Card className="bg-gray-700 border-gray-600">
                                      <CardContent className="p-3">
                                        <div className="text-xs text-gray-400">Non-Billable</div>
                                        <div className="text-lg font-bold text-gray-400">${summary.nonBillableSpend.toFixed(2)}</div>
                                      </CardContent>
                                    </Card>
                                    <Card className="bg-gray-700 border-gray-600">
                                      <CardContent className="p-3">
                                        <div className="text-xs text-gray-400">Transactions</div>
                                        <div className="text-lg font-bold text-blue-400">{summary.transactionCount}</div>
                                      </CardContent>
                                    </Card>
                                  </div>

                                  {/* Work Order Summary */}
                                  {workOrderGroups.length > 0 ? (
                                    <div>
                                      <h5 className="text-md font-semibold text-white mb-2">Work Orders with Expenses</h5>
                                      <div className="bg-gray-700 rounded-lg overflow-hidden">
                                        <table className="w-full text-sm">
                                          <thead>
                                            <tr className="bg-gray-800 border-b border-gray-600">
                                              <th className="text-left p-3 text-gray-300">Work Order</th>
                                              <th className="text-left p-3 text-gray-300">Technician</th>
                                              <th className="text-right p-3 text-gray-300">Total</th>
                                              <th className="text-right p-3 text-gray-300">Billable</th>
                                              <th className="text-right p-3 text-gray-300">Non-Billable</th>
                                              <th className="text-center p-3 text-gray-300">Transactions</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {workOrderGroups.map(group => (
                                              <tr key={group.job.id} className="border-b border-gray-600/50">
                                                <td className="p-3 text-white">{group.job.description}</td>
                                                <td className="p-3 text-gray-300">{group.job.technician || 'Unassigned'}</td>
                                                <td className="p-3 text-right text-white">${group.totalAmount.toFixed(2)}</td>
                                                <td className="p-3 text-right text-green-400">${group.billableAmount.toFixed(2)}</td>
                                                <td className="p-3 text-right text-gray-400">${group.nonBillableAmount.toFixed(2)}</td>
                                                <td className="p-3 text-center text-blue-400">{group.transactionCount}</td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-center py-8 text-gray-400">
                                      No expenses found for this property in {reportMonth}
                                    </div>
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setMonthlyReportDialogOpen(false)}>
                        Cancel
                      </Button>
                      {selectedReportProperty && (
                        <Button 
                          onClick={() => {
                            const reportData = generateMonthlyReportData(selectedReportProperty, reportMonth);
                            exportMonthlyReportToCSV(reportData);
                          }}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Export to CSV
                        </Button>
                      )}
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
            {activeTab === "wallet" && (
              <>
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    {role === 'technician' ? `Active Cards for ${technicianName}` : 'Active Cards'}
                  </h3>
                  {/* Filters for job and property */}
                  <div className="flex gap-6 overflow-x-auto pb-2">
                    {(role === 'technician' ? technicianCards : properties[0].cards.slice(0, 2)).map((card, idx) => {
                      // Mock card data for demo
                      const brand = idx % 2 === 0 ? "Amex" : "Chase";
                      const brandColor = brand === "Amex" ? "from-cyan-700 to-blue-900" : "from-indigo-700 to-purple-900";
                      const available = card.balance;
                      const limit = 5000;
                      const percent = Math.min(100, Math.round((available / limit) * 100));
                      return (
                        <div key={card.id} className={`relative w-80 h-48 rounded-2xl shadow-xl bg-gradient-to-br ${brandColor} p-6 flex flex-col justify-between text-white`}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-lg font-bold tracking-wide">{brand}</span>
                            <CreditCard className="h-7 w-7 text-white/80" />
                                </div>
                          <div className="text-2xl font-mono tracking-widest mb-2">{card.number}</div>
                          <div className="flex justify-between text-xs mb-2">
                            <span>Exp: 12/26</span>
                            <span>Limit: ${limit.toLocaleString()}</span>
                                </div>
                          <div className="flex justify-between items-end text-xs mb-1">
                            <span>Available: <span className="font-semibold">${available.toLocaleString()}</span></span>
                            <span className="text-white/70">John Smith</span>
                                </div>
                          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mt-1">
                            <div className="h-full rounded-full bg-green-400 transition-all" style={{ width: `${percent}%` }} />
                                </div>
                                </div>
                      );
                    })}
                              </div>
                        </div>

                {/* Completed Expenses Table */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">Completed Expenses</h3>
                    {role === 'pm' && (
                      <Button 
                        className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                        onClick={() => setHelpRequestDialogOpen(true)}
                      >
                        <MessageSquare className="h-4 w-4" />
                        Ask Central Office
                      </Button>
                    )}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="sticky top-0 z-10">
                        <tr className="bg-gray-900 border-b border-gray-700">
                          <th className="text-left py-3 px-4 font-semibold text-white">Date</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Merchant</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Amount</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Made By</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Property</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Work Order</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Billable</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Memo</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Receipt</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filterExpensesByRole([...transactions, ...technicianTransactions])
                          .filter(txn => txn.status === 'reconciled' && (txn.jobId || txnAssignments[txn.id]?.job))
                          .map((txn, idx) => {
                            const assignment = txnAssignments[txn.id] || {};
                            const memo = txnMemos[txn.id] || '';
                            const receipt = txnReceipts[txn.id] || null;
                            const job = jobs.find(j => j.id === txn.jobId);
                            const property = job ? properties.find(p => p.name === job.property) : undefined;
                            const isEditing = editingExpense && editingExpense.id === txn.id;
                            return (
                              <tr key={txn.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                                <td className="py-3 px-4 text-gray-300">{txn.date}</td>
                                <td className="py-3 px-4 text-gray-300">{txn.vendor}</td>
                                <td className="py-3 px-4 text-gray-300">${txn.amount.toFixed(2)}</td>
                                <td className="py-3 px-4 text-gray-300">{txn.madeBy}</td>
                                <td className="py-3 px-4">
                                  {isEditing ? (
                                    <Select
                                      value={expenseForm.property}
                                      onValueChange={value => setExpenseForm(prev => ({ ...prev, property: value }))}
                                    >
                                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-32">
                                        <SelectValue placeholder="Property" />
                                      </SelectTrigger>
                                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                                        {properties.map(property => (
                                          <SelectItem key={property.id} value={property.name} className="bg-gray-900 text-white">
                                            {property.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  ) : (
                                    assignment.property || (property ? property.name : 'Not Assigned')
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  {isEditing ? (
                                    <Select
                                      value={expenseForm.job}
                                      onValueChange={value => setExpenseForm(prev => ({ ...prev, job: value }))}
                                    >
                                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-32">
                                        <SelectValue placeholder="Job" />
                                      </SelectTrigger>
                                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                                        <SelectItem value="none" className="bg-gray-900 text-white">No job assigned</SelectItem>
                                        {jobs.map(job => (
                                          <SelectItem key={job.id} value={job.id} className="bg-gray-900 text-white">
                                            {job.description}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  ) : (
                                    assignment.job ? (jobs.find(j => j.id === assignment.job)?.description || assignment.job) : (job ? job.description : 'Not Assigned')
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  {isEditing ? (
                                    <Select
                                      value={expenseForm.billable ? 'yes' : 'no'}
                                      onValueChange={value => setExpenseForm(prev => ({ ...prev, billable: value === 'yes' }))}
                                    >
                                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-24">
                                        <SelectValue placeholder="Billable" />
                                      </SelectTrigger>
                                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                                        <SelectItem value="yes" className="bg-gray-900 text-white">Yes</SelectItem>
                                        <SelectItem value="no" className="bg-gray-900 text-white">No</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  ) : (
                                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${txn.billable ? 'bg-green-700 text-green-100' : 'bg-gray-700 text-gray-200'}`}>
                                      {txn.billable ? 'Yes' : 'No'}
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  {isEditing ? (
                                    <Input
                                      className="bg-gray-700 border-gray-600 text-white w-32 text-xs"
                                      placeholder="Memo"
                                      value={expenseForm.memo}
                                      onChange={e => setExpenseForm(prev => ({ ...prev, memo: e.target.value }))}
                                    />
                                  ) : (
                                    txn.memo || '-'
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  {isEditing ? (
                                    <div className="flex items-center gap-2">
                                      <label className="cursor-pointer">
                                        <input
                                          type="file"
                                          accept="image/*,application/pdf"
                                          className="hidden"
                                          onChange={e => {
                                            const file = e.target.files?.[0] || null;
                                            setExpenseForm(prev => ({ ...prev, receipt: file ? file.name : '' }));
                                          }}
                                        />
                                        <Paperclip className="h-4 w-4 text-blue-400 hover:text-blue-300" />
                                      </label>
                                      {expenseForm.receipt && (
                                        <span className="text-xs text-green-400">{expenseForm.receipt}</span>
                                      )}
                                    </div>
                                  ) : (
                                    txn.receipt ? <FileText className="h-4 w-4 text-blue-400" /> : '-'
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  {isEditing ? (
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        disabled={!expenseForm.property || !expenseForm.memo || !expenseForm.receipt}
                                        onClick={() => {
                                          if (expenseForm.property && expenseForm.memo && expenseForm.receipt) {
                                            const updatedTxn = {
                                              ...txn,
                                              jobId: expenseForm.job === 'none' ? '' : expenseForm.job,
                                              billable: expenseForm.billable,
                                              memo: expenseForm.memo,
                                              receipt: expenseForm.receipt,
                                              status: 'reconciled' as const // ensure status is valid and typed
                                            };
                                            setTransactions(prev => prev.map(t => t.id === txn.id ? updatedTxn : t));
                                            setEditingExpense(null);
                                            setExpenseForm({
                                              property: '',
                                              job: '',
                                              billable: true,
                                              memo: '',
                                              receipt: ''
                                            });
                                          }
                                        }}
                                      >
                                        <CheckCircle className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                        onClick={() => {
                                          setEditingExpense(null);
                                          setExpenseForm({
                                            property: '',
                                            job: '',
                                            billable: true,
                                            memo: '',
                                            receipt: ''
                                          });
                                        }}
                                      >
                                        <XCircle className="h-4 w-4" />
                                      </Button>
                            </div>
                                  ) : (
                          <Button
                                      size="sm"
                                      className="bg-blue-600 hover:bg-blue-700 text-white"
                                      onClick={() => {
                                        setEditingExpense(txn as Transaction);
                                        setExpenseForm({
                                          property: assignment.property || (property ? property.name : ''),
                                          job: assignment.job || (job ? job.id : ''),
                                          billable: txn.billable,
                                          memo: txn.memo || '',
                                          receipt: txn.receipt || ''
                                        });
                                      }}
                                    >
                                      <Pencil className="h-4 w-4" />
                          </Button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                        </div>
                        </div>

                {/* Uncategorized / Needs Review Table */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">Uncategorized / Needs Review</h3>
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setNewExpenseDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Expense
                    </Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="sticky top-0 z-10">
                        <tr className="bg-gray-900 border-b border-gray-700">
                          <th className="text-left py-3 px-4 font-semibold text-white">Date</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Merchant</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Amount</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Made By</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Property</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Work Order</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Billable</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Memo</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Receipt</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filterExpensesByRole([...transactions, ...technicianTransactions])
                          .filter(txn => txn.status === 'pending' || !txn.jobId)
                          .map((txn, idx) => {
                            const job = jobs.find(j => j.id === txn.jobId);
                            const property = job ? properties.find(p => p.name === job.property) : undefined;
                            const isEditing = inlineEditingExpense === txn.id;
                            
                            return (
                              <tr key={txn.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                                <td className="py-3 px-4 text-gray-300">{txn.date}</td>
                                <td className="py-3 px-4 text-gray-300">{txn.vendor}</td>
                                <td className="py-3 px-4 text-gray-300">${txn.amount.toFixed(2)}</td>
                                <td className="py-3 px-4 text-gray-300">{txn.madeBy}</td>
                                <td className="py-3 px-4">
                                  {isEditing ? (
                                    <Select 
                                      value={inlineExpenseForm.property} 
                                      onValueChange={(value) => setInlineExpenseForm(prev => ({ ...prev, property: value }))}
                                    >
                                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-32">
                                        <SelectValue placeholder="Property" />
                                      </SelectTrigger>
                                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                                        {properties.map(property => (
                                          <SelectItem key={property.id} value={property.name} className="bg-gray-900 text-white">
                                            {property.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  ) : (
                                    <span className="text-gray-300">{property ? property.name : 'Not Assigned'}</span>
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  {isEditing ? (
                                    <Select 
                                      value={inlineExpenseForm.job} 
                                      onValueChange={(value) => setInlineExpenseForm(prev => ({ ...prev, job: value }))}
                                    >
                                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-32">
                                        <SelectValue placeholder="Job" />
                                      </SelectTrigger>
                                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                                        <SelectItem value="none" className="bg-gray-900 text-white">No job assigned</SelectItem>
                                        {jobs.map(job => (
                                          <SelectItem key={job.id} value={job.id} className="bg-gray-900 text-white">
                                            {job.description}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  ) : (
                                    <span className="text-gray-300">{job ? job.description : 'Not Assigned'}</span>
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  {isEditing ? (
                                    <Select
                                      value={inlineExpenseForm.billable ? 'yes' : 'no'}
                                      onValueChange={value => setInlineExpenseForm(prev => ({ ...prev, billable: value === 'yes' }))}
                                    >
                                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-24">
                                        <SelectValue placeholder="Billable" />
                                      </SelectTrigger>
                                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                                        <SelectItem value="yes" className="bg-gray-900 text-white">Yes</SelectItem>
                                        <SelectItem value="no" className="bg-gray-900 text-white">No</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  ) : (
                                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${txn.billable ? 'bg-green-700 text-green-100' : 'bg-gray-700 text-gray-200'}`}>
                                      {txn.billable ? 'Yes' : 'No'}
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  {isEditing ? (
                                    <Input
                                      className="bg-gray-700 border-gray-600 text-white w-32 text-xs"
                                      placeholder="Memo"
                                      value={inlineExpenseForm.memo}
                                      onChange={e => setInlineExpenseForm(prev => ({ ...prev, memo: e.target.value }))}
                                    />
                                  ) : (
                                    <span className="text-gray-300">{txn.memo || '-'}</span>
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  {isEditing ? (
                                    <div className="flex items-center gap-2">
                                      <label className="cursor-pointer">
                                        <input
                                          type="file"
                                          accept="image/*,application/pdf"
                                          className="hidden"
                                          onChange={e => {
                                            const file = e.target.files?.[0] || null;
                                            setInlineExpenseForm(prev => ({ ...prev, receipt: file ? file.name : '' }));
                                          }}
                                        />
                                        <Paperclip className="h-4 w-4 text-blue-400 hover:text-blue-300" />
                                      </label>
                                      {inlineExpenseForm.receipt && (
                                        <span className="text-xs text-green-400">{inlineExpenseForm.receipt}</span>
                                      )}
                                  </div>
                                  ) : (
                                    <span className="text-gray-300">{txn.receipt ? '✓' : '-'}</span>
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  {isEditing ? (
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        disabled={!inlineExpenseForm.property || !inlineExpenseForm.memo || !inlineExpenseForm.receipt}
                                        onClick={() => {
                                          if (inlineExpenseForm.property && inlineExpenseForm.memo && inlineExpenseForm.receipt) {
                                            // Update the transaction
                                            const updatedTxn = {
                                              ...txn,
                                              status: 'reconciled' as const,
                                              jobId: inlineExpenseForm.job === 'none' ? '' : inlineExpenseForm.job,
                                              memo: inlineExpenseForm.memo,
                                              receipt: inlineExpenseForm.receipt
                                            };
                                            
                                            setTransactions(prev => 
                                              prev.map(t => t.id === txn.id ? updatedTxn : t)
                                            );
                                            
                                            setInlineEditingExpense(null);
                                            setInlineExpenseForm({
                                              property: '',
                                              job: '',
                                              billable: true,
                                              memo: '',
                                              receipt: ''
                                            });
                                          }
                                        }}
                                      >
                                        <CheckCircle className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                        onClick={() => {
                                          setInlineEditingExpense(null);
                                          setInlineExpenseForm({
                                            property: '',
                                            job: '',
                                            billable: true,
                                            memo: '',
                                            receipt: ''
                                          });
                                        }}
                                      >
                                        <XCircle className="h-4 w-4" />
                                      </Button>
                                  </div>
                                  ) : (
                                    <Button
                                      size="sm"
                                      className="bg-blue-600 hover:bg-blue-700 text-white"
                                      onClick={() => {
                                        setInlineEditingExpense(txn.id);
                                        setInlineExpenseForm({
                                          property: property ? property.name : '',
                                          job: job ? job.id : '',
                                          billable: txn.billable,
                                          memo: txn.memo || '',
                                          receipt: ''
                                        });
                                      }}
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                    </Button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                                </div>
                </div>
              </>
            )}
            {activeTab === "technicianExpenses" && (
              <>
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white mb-4">My Expenses - {technicianName}</h3>
                    <Button 
                      className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                      onClick={() => setHelpRequestDialogOpen(true)}
                    >
                      <MessageSquare className="h-4 w-4" />
                      Ask Central Office
                    </Button>
                  </div>
                  <div className="flex gap-6 overflow-x-auto pb-2">
                    {technicianCards.map((card, idx) => {
                      // Mock card data for demo
                      const brand = idx % 2 === 0 ? "Amex" : "Chase";
                      const brandColor = brand === "Amex" ? "from-cyan-700 to-blue-900" : "from-indigo-700 to-purple-900";
                      const available = card.balance;
                      const limit = 5000;
                      const percent = Math.min(100, Math.round((available / limit) * 100));
                      return (
                        <div key={card.id} className={`relative w-80 h-48 rounded-2xl shadow-xl bg-gradient-to-br ${brandColor} p-6 flex flex-col justify-between text-white`}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-lg font-bold tracking-wide">{brand}</span>
                            <CreditCard className="h-7 w-7 text-white/80" />
                          </div>
                          <div className="text-2xl font-mono tracking-widest mb-2">{card.number}</div>
                          <div className="flex justify-between text-xs mb-2">
                            <span>Exp: 12/26</span>
                            <span>Limit: ${limit.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-end text-xs mb-1">
                            <span>Available: <span className="font-semibold">${available.toLocaleString()}</span></span>
                            <span className="text-white/70">{technicianName}</span>
                          </div>
                          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mt-1">
                            <div className="h-full rounded-full bg-green-400 transition-all" style={{ width: `${percent}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* My Completed Expenses Table */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">My Completed Expenses</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="sticky top-0 z-10">
                        <tr className="bg-gray-900 border-b border-gray-700">
                          <th className="text-left py-3 px-4 font-semibold text-white">Date</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Merchant</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Amount</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Made By</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Property</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Work Order</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Billable</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Memo</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Receipt</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...transactions, ...technicianTransactions]
                          .filter(txn => txn.cardHolder === technicianName && txn.status === 'reconciled' && (txn.jobId || txnAssignments[txn.id]?.job))
                          .map((txn, idx) => {
                            const job = jobs.find(j => j.id === txn.jobId);
                            const property = job ? properties.find(p => p.name === job.property) : undefined;
                            return (
                              <tr key={txn.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                                <td className="py-3 px-4 text-gray-300">{txn.date}</td>
                                <td className="py-3 px-4 text-gray-300">{txn.vendor}</td>
                                <td className="py-3 px-4 text-gray-300">${txn.amount.toFixed(2)}</td>
                                <td className="py-3 px-4 text-gray-300">{txn.madeBy}</td>
                                <td className="py-3 px-4 text-gray-300">{property ? property.name : 'Not Assigned'}</td>
                                <td className="py-3 px-4 text-gray-300">{job ? job.description : 'Not Assigned'}</td>
                                <td className="py-3 px-4">
                                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${txn.billable ? 'bg-green-700 text-green-100' : 'bg-gray-700 text-gray-200'}`}>
                                    {txn.billable ? 'Yes' : 'No'}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-gray-300">{txn.memo || '-'}</td>
                                <td className="py-3 px-4 text-gray-300">
                                  {txn.receipt ? <FileText className="h-4 w-4 text-blue-400" /> : '-'}
                                </td>
                                <td className="py-3 px-4">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-gray-300 hover:text-white hover:bg-blue-500/20"
                                    onClick={() => {
                                      setSelectedTransaction(txn as Transaction);
                                      setTransactionDetailsOpen(true);
                                    }}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* My Pending Expenses Table */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">My Pending Expenses</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="sticky top-0 z-10">
                        <tr className="bg-gray-900 border-b border-gray-700">
                          <th className="text-left py-3 px-4 font-semibold text-white">Date</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Merchant</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Amount</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Made By</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Property</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Work Order</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Billable</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Memo</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Receipt</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...transactions, ...technicianTransactions]
                          .filter(txn => txn.cardHolder === technicianName && (txn.status === 'pending' || !txn.jobId))
                          .map((txn, idx) => {
                            const job = jobs.find(j => j.id === txn.jobId);
                            const property = job ? properties.find(p => p.name === job.property) : undefined;
                            const isEditing = inlineEditingExpense === txn.id;
                            
                            return (
                              <tr key={txn.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                                <td className="py-3 px-4 text-gray-300">{txn.date}</td>
                                <td className="py-3 px-4 text-gray-300">{txn.vendor}</td>
                                <td className="py-3 px-4 text-gray-300">${txn.amount.toFixed(2)}</td>
                                <td className="py-3 px-4 text-gray-300">{txn.madeBy}</td>
                                <td className="py-3 px-4">
                                  {isEditing ? (
                                    <Select 
                                      value={inlineExpenseForm.property} 
                                      onValueChange={(value) => setInlineExpenseForm(prev => ({ ...prev, property: value }))}
                                    >
                                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-32">
                                        <SelectValue placeholder="Property" />
                                      </SelectTrigger>
                                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                                        {properties.map(property => (
                                          <SelectItem key={property.id} value={property.name} className="bg-gray-900 text-white">
                                            {property.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  ) : (
                                    <span className="text-gray-300">{property ? property.name : 'Not Assigned'}</span>
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  {isEditing ? (
                                    <Select 
                                      value={inlineExpenseForm.job} 
                                      onValueChange={(value) => setInlineExpenseForm(prev => ({ ...prev, job: value }))}
                                    >
                                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-32">
                                        <SelectValue placeholder="Job" />
                                      </SelectTrigger>
                                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                                        <SelectItem value="none" className="bg-gray-900 text-white">No job assigned</SelectItem>
                                        {jobs.map(job => (
                                          <SelectItem key={job.id} value={job.id} className="bg-gray-900 text-white">
                                            {job.description}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  ) : (
                                    <span className="text-gray-300">{job ? job.description : 'Not Assigned'}</span>
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  {isEditing ? (
                                    <Select
                                      value={inlineExpenseForm.billable ? 'yes' : 'no'}
                                      onValueChange={value => setInlineExpenseForm(prev => ({ ...prev, billable: value === 'yes' }))}
                                    >
                                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-24">
                                        <SelectValue placeholder="Billable" />
                                      </SelectTrigger>
                                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                                        <SelectItem value="yes" className="bg-gray-900 text-white">Yes</SelectItem>
                                        <SelectItem value="no" className="bg-gray-900 text-white">No</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  ) : (
                                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${txn.billable ? 'bg-green-700 text-green-100' : 'bg-gray-700 text-gray-200'}`}>
                                      {txn.billable ? 'Yes' : 'No'}
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  {isEditing ? (
                                    <Input
                                      className="bg-gray-700 border-gray-600 text-white w-32 text-xs"
                                      placeholder="Memo"
                                      value={inlineExpenseForm.memo}
                                      onChange={e => setInlineExpenseForm(prev => ({ ...prev, memo: e.target.value }))}
                                    />
                                  ) : (
                                    <span className="text-gray-300">{txn.memo || '-'}</span>
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  {isEditing ? (
                                    <div className="flex items-center gap-2">
                                      <label className="cursor-pointer">
                                        <input
                                          type="file"
                                          accept="image/*,application/pdf"
                                          className="hidden"
                                          onChange={e => {
                                            const file = e.target.files?.[0] || null;
                                            setInlineExpenseForm(prev => ({ ...prev, receipt: file ? file.name : '' }));
                                          }}
                                        />
                                        <Paperclip className="h-4 w-4 text-blue-400 hover:text-blue-300" />
                                      </label>
                                      {inlineExpenseForm.receipt && (
                                        <span className="text-xs text-green-400">{inlineExpenseForm.receipt}</span>
                                      )}
                                  </div>
                                  ) : (
                                    <span className="text-gray-300">{txn.receipt ? '✓' : '-'}</span>
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  {isEditing ? (
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        disabled={!inlineExpenseForm.property || !inlineExpenseForm.memo || !inlineExpenseForm.receipt}
                                        onClick={() => {
                                          if (inlineExpenseForm.property && inlineExpenseForm.memo && inlineExpenseForm.receipt) {
                                            // Update the transaction
                                            const updatedTxn = {
                                              ...txn,
                                              status: 'reconciled' as const,
                                              jobId: inlineExpenseForm.job === 'none' ? '' : inlineExpenseForm.job,
                                              memo: inlineExpenseForm.memo,
                                              receipt: inlineExpenseForm.receipt
                                            };
                                            
                                            setTransactions(prev => 
                                              prev.map(t => t.id === txn.id ? updatedTxn : t)
                                            );
                                            
                                            setInlineEditingExpense(null);
                                            setInlineExpenseForm({
                                              property: '',
                                              job: '',
                                              billable: true,
                                              memo: '',
                                              receipt: ''
                                            });
                                          }
                                        }}
                                      >
                                        <CheckCircle className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                        onClick={() => {
                                          setInlineEditingExpense(null);
                                          setInlineExpenseForm({
                                            property: '',
                                            job: '',
                                            billable: true,
                                            memo: '',
                                            receipt: ''
                                          });
                                        }}
                                      >
                                        <XCircle className="h-4 w-4" />
                                      </Button>
                                  </div>
                                  ) : (
                                    <Button
                                      size="sm"
                                      className="bg-blue-600 hover:bg-blue-700 text-white"
                                      onClick={() => {
                                        setInlineEditingExpense(txn.id);
                                        setInlineExpenseForm({
                                          property: property ? property.name : '',
                                          job: job ? job.id : '',
                                          billable: txn.billable,
                                          memo: txn.memo || '',
                                          receipt: ''
                                        });
                                      }}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
            {activeTab === "transactions" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-white">Transactions</h3>
                  <div className="flex gap-2">
                    {role === 'centralOffice' && (
                      <Button 
                        variant="outline" 
                        className="bg-blue-600 border-blue-600 text-white hover:bg-blue-700 hover:border-blue-700 flex items-center gap-2"
                        onClick={() => setNewTransactionDialogOpen(true)}
                      >
                        <Plus className="h-4 w-4" /> Add Transaction
                      </Button>
                    )}
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2" onClick={exportTransactionsToCSV}>
                      <DownloadCloud className="h-4 w-4" /> Export to CSV
                    </Button>
                  </div>
                </div>

                {/* Need Review Table - Central Office Only */}
                {role === 'centralOffice' && getTransactionsNeedingReview().length > 0 && (
                  <div className="mb-8">
                    <div 
                      className="flex items-center justify-between p-4 bg-red-900/20 border border-red-700 rounded-lg cursor-pointer hover:bg-red-900/30 transition-colors"
                      onClick={() => setReviewTableExpanded(!reviewTableExpanded)}
                    >
                      <h4 className="text-md font-semibold text-red-400 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Transactions Needing Review ({getTransactionsNeedingReview().length})
                      </h4>
                      <ChevronDown 
                        className={`h-5 w-5 text-red-400 transition-transform ${reviewTableExpanded ? 'rotate-180' : ''}`} 
                      />
                    </div>
                    
                    {reviewTableExpanded && (
                      <div className="mt-4 flex flex-col h-[300px] rounded-lg">
                        <div className="flex-1 overflow-x-auto overflow-y-auto">
                          <table className="min-w-full text-sm">
                            <thead className="sticky top-0 z-10">
                              <tr className="bg-red-900/30 border-b border-red-700">
                                <th className="text-left py-3 px-4 font-semibold text-white flex items-center gap-2">
                                  <AlertTriangle className="h-4 w-4 text-red-400" />
                                  Date
                                </th>
                                <th className="text-left py-3 px-4 font-semibold text-white">Merchant</th>
                                <th className="text-left py-3 px-4 font-semibold text-white">Amount</th>
                                <th className="text-left py-3 px-4 font-semibold text-white">Made By</th>
                                <th className="text-left py-3 px-4 font-semibold text-white">Property</th>
                                <th className="text-left py-3 px-4 font-semibold text-white">Work Order</th>
                                <th className="text-left py-3 px-4 font-semibold text-white">Billable</th>
                                <th className="text-left py-3 px-4 font-semibold text-white">Status</th>
                                <th className="text-left py-3 px-4 font-semibold text-white">AI Flag</th>
                              </tr>
                            </thead>
                            <tbody>
                              {getTransactionsNeedingReview().map((txn, idx) => {
                                const job = jobs.find(j => j.id === txn.jobId);
                                const property = job ? properties.find(p => p.name === job.property) : undefined;
                                const aiFlag = transactionReviewFlags[txn.id] || 
                                  (!txn.receipt ? 'Missing receipt' : 
                                   !txn.memo ? 'Missing memo' : 
                                   !txn.jobId ? 'Missing job assignment' : 
                                   txn.amount > 1000 ? 'Unusual amount' : 'Review needed');
                                
                                return (
                                  <tr key={txn.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                                    <td className="py-3 px-4 text-gray-300">{txn.date}</td>
                                    <td className="py-3 px-4 text-gray-300">{txn.vendor}</td>
                                    <td className="py-3 px-4 text-gray-300">${txn.amount.toFixed(2)}</td>
                                    <td className="py-3 px-4 text-gray-300">{txn.madeBy}</td>
                                    <td className="py-3 px-4 text-gray-300">{property ? property.name : 'Not Assigned'}</td>
                                    <td className="py-3 px-4 text-gray-300">{job ? job.description : 'Not Assigned'}</td>
                                    <td className="py-3 px-4">
                                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${
                                        txn.billable ? 'bg-green-700 text-green-100' : 'bg-gray-700 text-gray-200'
                                      }`}>
                                        {txn.billable ? 'Yes' : 'No'}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4">
                                      {txn.billable ? (
                                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${
                                          txn.status === 'reconciled' ? 'bg-blue-700 text-blue-100' : 'bg-red-700 text-red-100'
                                        }`}>
                                          {txn.status === 'reconciled' ? 'Reimbursed' : 'Pending'}
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold bg-gray-700 text-gray-300">
                                          Non-Reimbursable
                                        </span>
                                      )}
                                    </td>
                                    <td className="py-3 px-4">
                                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold bg-red-700 text-red-100">
                                        {aiFlag}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-4 items-end">
                  <div>
                    <Label className="text-gray-300">Status</Label>
                    <Select value={txnFilterStatus} onValueChange={setTxnFilterStatus}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-32">
                        <SelectValue>{txnFilterStatus === 'all' ? 'All' : txnFilterStatus.charAt(0).toUpperCase() + txnFilterStatus.slice(1)}</SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="reconciled">Reconciled</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-300">Billable</Label>
                    <Select value={txnFilterBillable} onValueChange={setTxnFilterBillable}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-32">
                        <SelectValue>{txnFilterBillable === 'all' ? 'All' : txnFilterBillable === 'billable' ? 'Billable' : 'Non-Billable'}</SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="billable">Billable</SelectItem>
                        <SelectItem value="nonbillable">Non-Billable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-300">Property</Label>
                    <Select value={txnFilterProperty} onValueChange={setTxnFilterProperty}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-40">
                        <SelectValue>{txnFilterProperty === 'all' ? 'All' : (properties.find(p => p.id === txnFilterProperty)?.name || '')}</SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="all">All</SelectItem>
                        {properties.map(property => (
                          <SelectItem key={property.id} value={property.id}>{property.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-300">Work Order</Label>
                    <Select value={txnFilterJob} onValueChange={setTxnFilterJob}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-40">
                        <SelectValue>{txnFilterJob === 'all' ? 'All' : (jobs.find(j => j.id === txnFilterJob)?.description || '')}</SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="all">All</SelectItem>
                        {jobs.map(job => (
                          <SelectItem key={job.id} value={job.id}>{job.description}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-300">Made By</Label>
                    <Select value={txnFilterMadeBy} onValueChange={setTxnFilterMadeBy}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-40">
                        <SelectValue>{txnFilterMadeBy === 'all' ? 'All' : txnFilterMadeBy}</SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="all">All</SelectItem>
                        {Array.from(new Set([...transactions, ...technicianTransactions].map(txn => txn.madeBy))).map(madeBy => (
                          <SelectItem key={madeBy} value={madeBy}>{madeBy}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-300">Date From</Label>
                    <Input type="date" className="bg-gray-800 border-gray-600 text-white w-36" value={txnFilterDateFrom} onChange={e => setTxnFilterDateFrom(e.target.value)} />
                  </div>
                  <div>
                    <Label className="text-gray-300">Date To</Label>
                    <Input type="date" className="bg-gray-800 border-gray-600 text-white w-36" value={txnFilterDateTo} onChange={e => setTxnFilterDateTo(e.target.value)} />
                  </div>
                </div>
                <div className="flex flex-col h-[400px] rounded-lg">
                  <div className="flex-1 overflow-x-auto overflow-y-auto">
                    <table className="min-w-full text-sm">
                      <thead className="sticky top-0 z-10">
                        <tr className="bg-gray-900 border-b border-gray-700">
                          <th className="text-left py-3 px-4 font-semibold text-white">Date</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Merchant</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Amount</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Made By</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Property</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Work Order</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Billable</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Status</th>
                          <th className="text-left py-3 px-4 font-semibold text-white">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTransactions.map((txn, idx) => {
                          const assignment = txnAssignments[txn.id] || {};
                          const memo = txnMemos[txn.id] || '';
                          const receipt = txnReceipts[txn.id] || null;
                          const job = jobs.find(j => j.id === txn.jobId);
                          const property = job ? properties.find(p => p.name === job.property) : undefined;
                          return (
                            <tr key={txn.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                              <td className="py-3 px-4 text-gray-300">{txn.date}</td>
                              <td className="py-3 px-4 text-gray-300">{txn.vendor}</td>
                              <td className="py-3 px-4 text-gray-300">${txn.amount.toFixed(2)}</td>
                              <td className="py-3 px-4 text-gray-300">{txn.madeBy}</td>
                              <td className="py-3 px-4 text-gray-300">{assignment.property || (property ? property.name : 'Not Assigned')}</td>
                              <td className="py-3 px-4 text-gray-300">{assignment.job ? (jobs.find(j => j.id === assignment.job)?.description || assignment.job) : (job ? job.description : 'Not Assigned')}</td>
                              <td className="py-3 px-4">
                                <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${
                                  txn.billable ? 'bg-green-700 text-green-100' : 'bg-gray-700 text-gray-200'
                                }`}>
                                  {txn.billable ? 'Yes' : 'No'}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                {txn.billable ? (
                                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${
                                    txn.status === 'reconciled' ? 'bg-blue-700 text-blue-100' : 'bg-red-700 text-red-100'
                                  }`}>
                                    {txn.status === 'reconciled' ? 'Reimbursed' : 'Pending'}
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold bg-gray-700 text-gray-300">
                                    Non-Reimbursable
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex gap-1">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-gray-300 hover:text-white hover:bg-blue-500/20"
                                    onClick={() => {
                                      setSelectedTransaction(txn as Transaction);
                                      setTransactionDetailsOpen(true);
                                    }}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  {role === 'centralOffice' && (
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-8 w-8 text-gray-300 hover:text-white hover:bg-green-500/20"
                                      onClick={() => handleEditTransaction(txn as Transaction)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
            {activeTab === "collateral" && (role === 'pm' || role === 'centralOffice') && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-white">Collateral Hub</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="bg-blue-600 border-blue-600 text-white hover:bg-blue-700 hover:border-blue-700 flex items-center gap-2"
                      onClick={() => setCollateralUploadDialogOpen(true)}
                    >
                      <Upload className="h-4 w-4" /> Upload Files
                    </Button>
                    <Button 
                      variant="outline" 
                      className="bg-purple-600 border-purple-600 text-white hover:bg-purple-700 hover:border-purple-700 flex items-center gap-2"
                      onClick={() => setAskAiModalOpen(true)}
                    >
                      <Bot className="h-4 w-4" /> Ask AI
                      <span className="text-xs text-purple-200 ml-2">⌘⇧K</span>
                    </Button>
                    {collateralSelectedDocs.length > 0 && (
                      <Button 
                        variant="outline" 
                        className="bg-green-600 border-green-600 text-white hover:bg-green-700 hover:border-green-700 flex items-center gap-2"
                        onClick={handleCollateralExportSelected}
                      >
                        <DownloadCloud className="h-4 w-4" /> Export Selected ({collateralSelectedDocs.length})
                      </Button>
                    )}
                  </div>
                </div>

                {/* AI Search Bar */}
                <div className="relative mb-6">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Bot className="absolute left-11 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
                    <Input 
                      placeholder="Ask anything — e.g. 'How much did we spend on Unit 22's plumbing?' or 'Find receipts where we were overcharged' (⌘K)"
                      className="bg-gray-800 border-gray-600 text-white pl-20 pr-4 py-4 text-lg rounded-xl focus:border-purple-500 focus:ring-purple-500"
                      value={aiSearchQuery}
                      onChange={(e) => {
                        setAiSearchQuery(e.target.value);
                        const suggestions = getAiSearchSuggestions(e.target.value);
                        setAiSearchSuggestions(suggestions);
                        setShowAiSuggestions(e.target.value.length > 0);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAiSearch(aiSearchQuery);
                        } else if (e.key === 'Escape') {
                          setShowAiSuggestions(false);
                        }
                      }}
                      onFocus={() => {
                        if (aiSearchQuery.length > 0) {
                          setShowAiSuggestions(true);
                        }
                      }}
                    />
                    {aiSearchLoading && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-400"></div>
                      </div>
                    )}
                  </div>

                  {/* AI Search Suggestions */}
                  {showAiSuggestions && aiSearchSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                      {aiSearchSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="px-4 py-3 hover:bg-gray-700 cursor-pointer text-gray-300 border-b border-gray-700 last:border-b-0"
                          onClick={() => {
                            setAiSearchQuery(suggestion);
                            setShowAiSuggestions(false);
                            handleAiSearch(suggestion);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <Bot className="h-4 w-4 text-purple-400" />
                            <span className="text-sm">{suggestion}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* AI Search Results */}
                {aiSearchResults && (
                  <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 space-y-4 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Bot className="h-5 w-5 text-purple-400" />
                      <h3 className="text-lg font-semibold text-white">AI Analysis</h3>
                    </div>
                    
                    {/* AI Summary */}
                    <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                      <p className="text-purple-100">{aiSearchResults.summary}</p>
                    </div>

                    {/* AI Insights */}
                    {aiSearchResults.insights && aiSearchResults.insights.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-300">Key Insights:</h4>
                        <ul className="space-y-1">
                          {aiSearchResults.insights.map((insight: string, index: number) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                              <span className="text-blue-400 mt-1">•</span>
                              {insight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Related Documents */}
                    {aiSearchResults.documents && aiSearchResults.documents.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-gray-300">Related Documents:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {aiSearchResults.documents.map((doc: any) => {
                            const IconComponent = getDocumentTypeIcon(doc.documentType);
                            return (
                              <div key={doc.id} className="bg-gray-700 border border-gray-600 rounded-lg p-3 hover:bg-gray-600 transition-colors">
                                <div className="flex items-center gap-2 mb-2">
                                  <IconComponent className="h-4 w-4 text-blue-400" />
                                  <span className="text-sm font-medium text-white truncate">{doc.filename}</span>
                                </div>
                                <div className="text-xs text-gray-400 space-y-1">
                                  <div>Property: {doc.propertyName}</div>
                                  <div>Uploaded: {doc.uploadDate}</div>
                                  {doc.amount && <div className="text-green-400">Amount: ${doc.amount.toLocaleString()}</div>}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Clear Results */}
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        onClick={() => {
                          setAiSearchResults(null);
                          setAiSearchQuery('');
                        }}
                      >
                        Clear Results
                      </Button>
                    </div>
                  </div>
                )}

                {/* Filters and Search */}
                <div className="mb-6 space-y-4">
                  <div className="flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[200px]">
                      <Label className="text-gray-300">Search</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        {collateralIsSearching && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                          </div>
                        )}
                        <Input 
                          placeholder="Search by filename, tags, or vendor..."
                          className="bg-gray-800 border-gray-600 text-white pl-10 pr-10"
                          value={collateralSearchQuery}
                          onChange={(e) => setCollateralSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-300">Property</Label>
                      <Select value={collateralFilterProperty} onValueChange={setCollateralFilterProperty}>
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-40">
                          <SelectValue>
                            {collateralFilterProperty === 'all' ? 'All Properties' : 
                             propertyOptions.find(p => p.id === collateralFilterProperty)?.name || 'All Properties'}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700 text-white">
                          <SelectItem value="all">All Properties</SelectItem>
                          {propertyOptions.map(property => (
                            <SelectItem key={property.id} value={property.id}>{property.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300">Document Type</Label>
                      <Select value={collateralFilterDocType} onValueChange={setCollateralFilterDocType}>
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-40">
                          <SelectValue>
                            {collateralFilterDocType === 'all' ? 'All Types' : 
                             documentTypeLabels[collateralFilterDocType as DocumentType] || 'All Types'}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700 text-white">
                          <SelectItem value="all">All Types</SelectItem>
                          {Object.entries(documentTypeLabels).map(([key, label]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300">Uploaded By</Label>
                      <Select value={collateralFilterUploadedBy} onValueChange={setCollateralFilterUploadedBy}>
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-40">
                          <SelectValue>
                            {collateralFilterUploadedBy === 'all' ? 'All Users' : collateralFilterUploadedBy}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700 text-white">
                          <SelectItem value="all">All Users</SelectItem>
                          {staffOptions.map(staff => (
                            <SelectItem key={staff.id} value={staff.name}>{staff.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 items-end">
                    <div>
                      <Label className="text-gray-300">Date From</Label>
                      <Input 
                        type="date" 
                        className="bg-gray-800 border-gray-600 text-white w-36" 
                        value={collateralFilterDateFrom} 
                        onChange={(e) => setCollateralFilterDateFrom(e.target.value)} 
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Date To</Label>
                      <Input 
                        type="date" 
                        className="bg-gray-800 border-gray-600 text-white w-36" 
                        value={collateralFilterDateTo} 
                        onChange={(e) => setCollateralFilterDateTo(e.target.value)} 
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCollateralViewMode('card')}
                        className={`${collateralViewMode === 'card' ? 'bg-blue-600 border-blue-600' : 'bg-gray-800 border-gray-600'} text-white`}
                      >
                        <Grid className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCollateralViewMode('list')}
                        className={`${collateralViewMode === 'list' ? 'bg-blue-600 border-blue-600' : 'bg-gray-800 border-gray-600'} text-white`}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Document Display */}
                {collateralIsSearching && (
                  <div className="mb-4 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-900/20 border border-blue-500/30 rounded-lg text-blue-300 text-sm">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-400"></div>
                      Searching...
                    </div>
                  </div>
                )}
                {collateralViewMode === 'card' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredCollateralDocs.map((doc) => {
                      const IconComponent = getDocumentTypeIcon(doc.documentType);
                      const isSelected = collateralSelectedDocs.includes(doc.id);
                      return (
                        <Card 
                          key={doc.id} 
                          className={`bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors cursor-pointer ${
                            isSelected ? 'border-blue-500 bg-blue-900/20' : ''
                          }`}
                          onClick={() => {
                            if (isSelected) {
                              setCollateralSelectedDocs(prev => prev.filter(id => id !== doc.id));
                            } else {
                              setCollateralSelectedDocs(prev => [...prev, doc.id]);
                            }
                          }}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <IconComponent className="h-5 w-5 text-blue-400" />
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-white break-words">{doc.filename}</div>
                                  <div className="text-xs text-gray-400">{documentTypeLabels[doc.documentType]}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                {isSelected && <Check className="h-4 w-4 text-blue-400" />}
                                {doc.status === 'expired' && <AlertTriangle className="h-4 w-4 text-red-400" />}
                              </div>
                            </div>
                            
                            <div className="space-y-2 text-xs">
                              <div className="flex justify-between items-start">
                                <span className="text-gray-400 shrink-0">Uploaded:</span>
                                <span className="text-gray-300 text-right">{doc.uploadDate}</span>
                              </div>
                              <div className="flex justify-between items-start">
                                <span className="text-gray-400 shrink-0">By:</span>
                                <span className="text-gray-300 text-right break-words ml-2">{doc.uploadedBy}</span>
                              </div>
                              <div className="flex justify-between items-start">
                                <span className="text-gray-400 shrink-0">Property:</span>
                                <span className="text-gray-300 text-right break-words ml-2">{doc.propertyName}</span>
                              </div>
                              <div className="flex justify-between items-start">
                                <span className="text-gray-400 shrink-0">Size:</span>
                                <span className="text-gray-300 text-right">{formatFileSize(doc.fileSize)}</span>
                              </div>
                              {doc.amount && (
                                <div className="flex justify-between items-start">
                                  <span className="text-gray-400 shrink-0">Amount:</span>
                                  <span className="text-green-400 text-right">${doc.amount.toLocaleString()}</span>
                                </div>
                              )}
                              {doc.expiryDate && (
                                <div className="flex justify-between items-start">
                                  <span className="text-gray-400 shrink-0">Expires:</span>
                                  <span className={`text-right ${doc.status === 'expired' ? 'text-red-400' : 'text-yellow-400'}`}>
                                    {doc.expiryDate}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            {doc.tags.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-1">
                                {doc.tags.slice(0, 3).map((tag, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                                    {tag}
                                  </Badge>
                                ))}
                                {doc.tags.length > 3 && (
                                  <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                                    +{doc.tags.length - 3}
                                  </Badge>
                                )}
                              </div>
                            )}
                            
                            <div className="mt-3 flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCollateralDocPreview(doc);
                                }}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Preview
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(doc.fileUrl, '_blank');
                                }}
                              >
                                <LinkIcon className="h-3 w-3" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-gray-800 rounded-lg">
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead className="bg-gray-900 border-b border-gray-700">
                          <tr>
                            <th className="text-left py-3 px-4 font-semibold text-white w-8">
                              <input
                                type="checkbox"
                                className="rounded bg-gray-700 border-gray-600"
                                checked={filteredCollateralDocs.length > 0 && filteredCollateralDocs.every(doc => collateralSelectedDocs.includes(doc.id))}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setCollateralSelectedDocs(filteredCollateralDocs.map(doc => doc.id));
                                  } else {
                                    setCollateralSelectedDocs([]);
                                  }
                                }}
                              />
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-white min-w-[200px]">Document</th>
                            <th className="text-left py-3 px-4 font-semibold text-white min-w-[120px]">Type</th>
                            <th className="text-left py-3 px-4 font-semibold text-white min-w-[100px]">Upload Date</th>
                            <th className="text-left py-3 px-4 font-semibold text-white min-w-[120px]">Uploaded By</th>
                            <th className="text-left py-3 px-4 font-semibold text-white min-w-[120px]">Property</th>
                            <th className="text-left py-3 px-4 font-semibold text-white min-w-[80px]">Size</th>
                            <th className="text-left py-3 px-4 font-semibold text-white min-w-[100px]">Amount</th>
                            <th className="text-left py-3 px-4 font-semibold text-white min-w-[100px]">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCollateralDocs.map((doc) => {
                            const IconComponent = getDocumentTypeIcon(doc.documentType);
                            const isSelected = collateralSelectedDocs.includes(doc.id);
                            return (
                              <tr key={doc.id} className={`border-b border-gray-700 hover:bg-gray-700/50 transition-colors ${
                                isSelected ? 'bg-blue-900/20' : 'bg-gray-800'
                              }`}>
                                <td className="py-3 px-4">
                                  <input
                                    type="checkbox"
                                    className="rounded bg-gray-700 border-gray-600"
                                    checked={isSelected}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setCollateralSelectedDocs(prev => [...prev, doc.id]);
                                      } else {
                                        setCollateralSelectedDocs(prev => prev.filter(id => id !== doc.id));
                                      }
                                    }}
                                  />
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <IconComponent className="h-4 w-4 text-blue-400 shrink-0" />
                                    <div className="min-w-0 flex-1">
                                      <div className="font-medium text-white break-words">{doc.filename}</div>
                                      {doc.description && (
                                        <div className="text-xs text-gray-400 break-words">{doc.description}</div>
                                      )}
                                    </div>
                                    {doc.status === 'expired' && <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />}
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-gray-300">
                                  <div className="break-words">
                                    {documentTypeLabels[doc.documentType]}
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-gray-300">{doc.uploadDate}</td>
                                <td className="py-3 px-4 text-gray-300">
                                  <div className="break-words">{doc.uploadedBy}</div>
                                </td>
                                <td className="py-3 px-4 text-gray-300">
                                  <div className="break-words">{doc.propertyName}</div>
                                </td>
                                <td className="py-3 px-4 text-gray-300">{formatFileSize(doc.fileSize)}</td>
                                <td className="py-3 px-4 text-gray-300">
                                  {doc.amount ? `$${doc.amount.toLocaleString()}` : '-'}
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                                      onClick={() => handleCollateralDocPreview(doc)}
                                    >
                                      <Eye className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                                      onClick={() => window.open(doc.fileUrl, '_blank')}
                                    >
                                      <LinkIcon className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {filteredCollateralDocs.length === 0 && !collateralIsSearching && (
                  <div className="text-center py-12">
                    <FileArchive className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-300 mb-2">No documents found</h3>
                    <p className="text-gray-400 mb-4">
                      {collateralDebouncedSearchQuery || collateralFilterProperty !== 'all' || collateralFilterDocType !== 'all' 
                        ? 'Try adjusting your search criteria or filters'
                        : 'Upload your first document to get started'}
                    </p>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => setCollateralUploadDialogOpen(true)}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Files
                    </Button>
                  </div>
                )}
              </>
            )}
            {activeTab === "properties" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-white">Properties</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-gray-900 border-b border-gray-700">
                        <th className="text-left py-3 px-4 font-semibold text-white w-8"></th>
                        <th className="text-left py-3 px-4 font-semibold text-white">Property</th>
                        <th className="text-left py-3 px-4 font-semibold text-white">Address</th>
                      </tr>
                    </thead>
                    <tbody>
                      {properties.map((property) => (
                        <React.Fragment key={property.id}>
                          <tr 
                            className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer"
                            onClick={() => setExpandedPropertyEmployees(expandedPropertyEmployees === property.id ? null : property.id)}
                          >
                            <td className="py-3 px-4">
                              <ChevronDown 
                                className={`h-4 w-4 text-gray-400 transition-transform ${
                                  expandedPropertyEmployees === property.id ? 'rotate-180' : ''
                                }`} 
                              />
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-medium text-white">{property.name}</div>
                            </td>
                            <td className="py-3 px-4 text-gray-300">{property.address}</td>
                          </tr>
                          {expandedPropertyEmployees === property.id && (
                            <>
                              {/* Owner Information Row */}
                              <tr className="bg-gray-900/50 border-b border-gray-700">
                                <td></td>
                                <td colSpan={2} className="py-4 px-4">
                                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                                    <h5 className="text-sm font-semibold text-blue-300 mb-3 flex items-center gap-2">
                                      <User className="h-4 w-4" />
                                      Owner Information
                                    </h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <span className="text-gray-400">Name:</span>
                                        <span className="text-white ml-2 font-medium">{property.ownerName}</span>
                                      </div>
                                      <div>
                                        <span className="text-gray-400">Phone:</span>
                                        <span className="text-white ml-2">{property.ownerPhone}</span>
                                      </div>
                                      <div>
                                        <span className="text-gray-400">Email:</span>
                                        <span className="text-blue-300 ml-2">{property.ownerEmail}</span>
                                      </div>
                                      <div>
                                        <span className="text-gray-400">Preferred Contact:</span>
                                        <span className="text-yellow-300 ml-2 capitalize">{property.ownerPreferredContact}</span>
                                      </div>
                                      <div className="md:col-span-2">
                                        <span className="text-gray-400">Address:</span>
                                        <span className="text-white ml-2">{property.ownerAddress}</span>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                              
                              {/* Staff Information Row */}
                              <tr className="bg-gray-900">
                                <td></td>
                                <td colSpan={2} className="p-0">
                                  <div className="p-4">
                                    <h5 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                      <User className="h-4 w-4" />
                                      Staff at {property.name}
                                    </h5>
                                    <table className="min-w-full text-sm">
                                      <thead>
                                        <tr className="bg-gray-800 border-b border-gray-700">
                                          <th className="text-left py-2 px-3 font-semibold text-white">Name</th>
                                          <th className="text-left py-2 px-3 font-semibold text-white">Role</th>
                                          <th className="text-left py-2 px-3 font-semibold text-white">Phone</th>
                                          <th className="text-left py-2 px-3 font-semibold text-white">Email</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {property.staff.map((employee, index) => (
                                          <tr key={index} className="bg-gray-900 border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                                            <td className="py-2 px-3 text-gray-300">{employee.name}</td>
                                            <td className="py-2 px-3 text-gray-300">{employee.role}</td>
                                            <td className="py-2 px-3 text-gray-300">{employee.phone}</td>
                                            <td className="py-2 px-3 text-gray-300">{employee.email}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </td>
                              </tr>
                            </>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
            {activeTab === "staff" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-white">Technicians</h3>
    </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Personal Information Card */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                          <User className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white">{technicianName}</h4>
                          <p className="text-gray-400">HVAC Technician</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label className="text-gray-400">Employee ID</Label>
                          <span className="text-white">TECH-001</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <Label className="text-gray-400">Email</Label>
                          <span className="text-white">alice.johnson@company.com</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <Label className="text-gray-400">Phone</Label>
                          <span className="text-white">(555) 123-4567</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <Label className="text-gray-400">Hire Date</Label>
                          <span className="text-white">March 15, 2023</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <Label className="text-gray-400">Status</Label>
                          <Badge className="bg-green-600 text-white">Active</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Work Statistics Card */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Work Statistics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-gray-700 rounded-lg">
                          <div className="text-2xl font-bold text-blue-400">{technicianWorkOrders.length}</div>
                          <div className="text-sm text-gray-400">Total Work Orders</div>
                        </div>
                        <div className="text-center p-3 bg-gray-700 rounded-lg">
                          <div className="text-2xl font-bold text-green-400">{technicianFinishedJobs.length}</div>
                          <div className="text-sm text-gray-400">Completed</div>
                        </div>
                        <div className="text-center p-3 bg-gray-700 rounded-lg">
                          <div className="text-2xl font-bold text-yellow-400">{technicianInProgressJobs.length}</div>
                          <div className="text-sm text-gray-400">In Progress</div>
                        </div>
                        <div className="text-center p-3 bg-gray-700 rounded-lg">
                          <div className="text-2xl font-bold text-red-400">{technicianOverdueJobs.length}</div>
                          <div className="text-sm text-gray-400">Overdue</div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-700">
                        <h5 className="text-sm font-semibold text-white mb-2">This Month's Expenses</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Total Spent</span>
                            <span className="text-white">${technicianTotalSpend.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Billable</span>
                            <span className="text-green-400">${technicianBillableSpend.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Non-Billable</span>
                            <span className="text-yellow-400">${technicianNonBillableSpend.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Skills & Certifications Card */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Skills & Certifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                          <div>
                            <div className="font-medium text-white">HVAC Installation</div>
                            <div className="text-sm text-gray-400">Certified Technician</div>
                          </div>
                          <Badge className="bg-green-600 text-white">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                          <div>
                            <div className="font-medium text-white">Refrigeration Systems</div>
                            <div className="text-sm text-gray-400">EPA Certified</div>
                          </div>
                          <Badge className="bg-green-600 text-white">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                          <div>
                            <div className="font-medium text-white">Electrical Systems</div>
                            <div className="text-sm text-gray-400">Licensed Electrician</div>
                          </div>
                          <Badge className="bg-green-600 text-white">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                          <div>
                            <div className="font-medium text-white">Plumbing</div>
                            <div className="text-sm text-gray-400">Basic Certification</div>
                          </div>
                          <Badge className="bg-yellow-600 text-white">Pending</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Activity Card */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="text-sm text-white">Completed HVAC maintenance at Stanford GSB</p>
                            <p className="text-xs text-gray-400">2 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="text-sm text-white">Started work order at Sunnyvale 432</p>
                            <p className="text-xs text-gray-400">1 day ago</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="text-sm text-white">Submitted expense report for $150.00</p>
                            <p className="text-xs text-gray-400">2 days ago</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="text-sm text-white">Received new work order assignment</p>
                            <p className="text-xs text-gray-400">3 days ago</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
            {activeTab === "cards" && role === 'centralOffice' && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-white">Enhanced Card Management</h3>
                  <div className="flex gap-2">
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                      onClick={() => setIssueCardDialogOpen(true)}
                    >
                      <Plus className="h-4 w-4" />
                      Issue New Card
                    </Button>
                    <Button 
                      className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                      onClick={() => setConnectCardDialogOpen(true)}
                    >
                      <CreditCard className="h-4 w-4" />
                      Connect Existing Card
                    </Button>
                  </div>
                </div>

                {/* Enhanced Cards Display */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {enhancedCards.map((card) => (
                    <Card key={card.id} className="bg-gray-800 border-gray-700">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-white flex items-center gap-2">
                              <CreditCard className="h-5 w-5" />
                              {card.holder}
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                              {card.position} • {card.type} Card
                            </CardDescription>
                          </div>
                          <Badge 
                            className={`${
                              card.status === 'active' ? 'bg-green-600' : 
                              card.status === 'inactive' ? 'bg-gray-600' : 
                              card.status === 'blocked' ? 'bg-red-600' : 'bg-yellow-600'
                            } text-white`}
                          >
                            {card.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400">{card.brand}</span>
                            <span className="text-white font-mono">{card.number}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Expires</span>
                            <span className="text-white">{card.expiryDate}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Available</span>
                            <span className="text-green-400">${card.balance.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Limit</span>
                            <span className="text-white">${card.limit.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">This Month</span>
                            <span className="text-yellow-400">${card.monthlySpend.toLocaleString()}</span>
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-gray-400 mb-2">Assigned Properties:</div>
                          <div className="flex flex-wrap gap-1">
                            {card.assignedProperties.map((propId) => {
                              const property = properties.find(p => p.id === propId);
                              return (
                                <Badge key={propId} variant="outline" className="text-xs border-blue-500 text-blue-300">
                                  {property?.name || propId}
                                </Badge>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-gray-400 mb-2">Vendor Restrictions:</div>
                          <div className="flex flex-wrap gap-1">
                            {card.vendorRestrictions.slice(0, 3).map((vendor) => (
                              <Badge key={vendor} variant="outline" className="text-xs border-purple-500 text-purple-300">
                                {vendor}
                              </Badge>
                            ))}
                            {card.vendorRestrictions.length > 3 && (
                              <Badge variant="outline" className="text-xs border-gray-500 text-gray-400">
                                +{card.vendorRestrictions.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-400">Last Used:</span>
                          <span className="text-gray-300">{card.lastUsed}</span>
                        </div>

                        {card.isExistingCard && (
                          <Badge className="w-full justify-center bg-orange-600 text-white">
                            Connected External Card
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
            {activeTab === "policy" && (
              <>
                {/* Expense Policy Section */}
                <div className="mb-6 p-4 bg-gray-800 border border-gray-700 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Expense Policy
                    </h3>
                    <Button 
                      variant="outline" 
                      className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
                      onClick={() => setExpensePolicyDialogOpen(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Expense Policy
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {policyRules.map(rule => (
                      <div key={rule.id} className="p-3 bg-gray-900 rounded-lg border border-gray-600">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-blue-300">{rule.category}</span>
                          <div className="flex items-center gap-2">
                            {rule.aiEnabled && (
                              <Badge className="bg-purple-600 text-white text-xs">AI</Badge>
                            )}
                            <Badge className={rule.active ? "bg-green-600 text-white text-xs" : "bg-gray-600 text-white text-xs"}>
                              {rule.active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-300">{rule.rule}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-white">Expense Clarification Requests</h3>
                  <div className="flex gap-2">
                    <Badge className="bg-orange-600 text-white">
                      {expenseRequests.filter(r => r.status === 'pending').length} Pending
                    </Badge>
                    <Badge className="bg-green-600 text-white">
                      {expenseRequests.filter(r => r.status === 'approved').length} Approved
                    </Badge>
                    <Badge className="bg-red-600 text-white">
                      {expenseRequests.filter(r => r.status === 'denied').length} Denied
                    </Badge>
                  </div>
                </div>

                {/* Enhanced Expense Requests Table */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="bg-gray-900 border-b border-gray-700">
                            <th className="text-left py-3 px-4 font-semibold text-white">Technician</th>
                            <th className="text-left py-3 px-4 font-semibold text-white">Question</th>
                            <th className="text-left py-3 px-4 font-semibold text-white">Amount</th>
                            <th className="text-left py-3 px-4 font-semibold text-white">Vendor</th>
                            <th className="text-left py-3 px-4 font-semibold text-white">Property</th>
                            <th className="text-left py-3 px-4 font-semibold text-white">Type</th>
                            <th className="text-left py-3 px-4 font-semibold text-white">Urgency</th>
                            <th className="text-left py-3 px-4 font-semibold text-white">Status</th>
                            <th className="text-left py-3 px-4 font-semibold text-white">AI Suggestion</th>
                            <th className="text-left py-3 px-4 font-semibold text-white">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {expenseRequests.map((request) => (
                            <tr key={request.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                              <td className="py-3 px-4">
                                <div className="text-white font-medium">{request.technicianName}</div>
                                <div className="text-xs text-gray-400">{new Date(request.createdAt).toLocaleDateString()}</div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-gray-300 max-w-xs">{request.question}</div>
                              </td>
                              <td className="py-3 px-4">
                                <span className="text-green-400 font-medium">${request.amount.toFixed(2)}</span>
                              </td>
                              <td className="py-3 px-4 text-gray-300">{request.vendor}</td>
                              <td className="py-3 px-4 text-gray-300">{request.property || 'N/A'}</td>
                              <td className="py-3 px-4">
                                <Badge className="bg-blue-600 text-white text-xs">
                                  {getTypeLabel(request.type)}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                <Badge className={`text-xs ${getUrgencyColor(request.urgency)}`}>
                                  {request.urgency}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                <Badge className={`text-xs ${getStatusColor(request.status)}`}>
                                  {request.status}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                <div className="max-w-xs text-xs text-gray-400 bg-purple-900/20 p-2 rounded border border-purple-500/30">
                                  <div className="flex items-center gap-1 mb-1">
                                    <span className="text-purple-300">🤖 AI:</span>
                                  </div>
                                  {request.aiSuggestion}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                {request.status === 'pending' ? (
                                  <div className="flex gap-1">
                                    <Button
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700 text-white"
                                      onClick={() => handleApproveExpenseRequest(request.id)}
                                    >
                                      <Check className="h-3 w-3 mr-1" />
                                      Approve
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-red-500 text-red-400 hover:bg-red-500/10"
                                      onClick={() => handleDenyExpenseRequest(request.id)}
                                    >
                                      <X className="h-3 w-3 mr-1" />
                                      Deny
                                    </Button>
                                  </div>
                                ) : (
                                  <span className="text-xs text-gray-500">
                                    {request.status === 'approved' ? 'Approved' : 'Denied'}
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
            {activeTab === "properties" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-white">Properties</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-gray-900 border-b border-gray-700">
                        <th className="text-left py-3 px-4 font-semibold text-white w-8"></th>
                        <th className="text-left py-3 px-4 font-semibold text-white">Property</th>
                        <th className="text-left py-3 px-4 font-semibold text-white">Address</th>
                      </tr>
                    </thead>
                    <tbody>
                      {properties.map((property) => (
                        <React.Fragment key={property.id}>
                          <tr 
                            className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer"
                            onClick={() => setExpandedPropertyEmployees(expandedPropertyEmployees === property.id ? null : property.id)}
                          >
                            <td className="py-3 px-4">
                              <ChevronDown 
                                className={`h-4 w-4 text-gray-400 transition-transform ${
                                  expandedPropertyEmployees === property.id ? 'rotate-180' : ''
                                }`} 
                              />
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-medium text-white">{property.name}</div>
                            </td>
                            <td className="py-3 px-4 text-gray-300">{property.address}</td>
                          </tr>
                          {expandedPropertyEmployees === property.id && (
                            <>
                              {/* Owner Information Row */}
                              <tr className="bg-gray-900/50 border-b border-gray-700">
                                <td></td>
                                <td colSpan={2} className="py-4 px-4">
                                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                                    <h5 className="text-sm font-semibold text-blue-300 mb-3 flex items-center gap-2">
                                      <User className="h-4 w-4" />
                                      Owner Information
                                    </h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <span className="text-gray-400">Name:</span>
                                        <span className="text-white ml-2 font-medium">{property.ownerName}</span>
                                      </div>
                                      <div>
                                        <span className="text-gray-400">Phone:</span>
                                        <span className="text-white ml-2">{property.ownerPhone}</span>
                                      </div>
                                      <div>
                                        <span className="text-gray-400">Email:</span>
                                        <span className="text-blue-300 ml-2">{property.ownerEmail}</span>
                                      </div>
                                      <div>
                                        <span className="text-gray-400">Preferred Contact:</span>
                                        <span className="text-yellow-300 ml-2 capitalize">{property.ownerPreferredContact}</span>
                                      </div>
                                      <div className="md:col-span-2">
                                        <span className="text-gray-400">Address:</span>
                                        <span className="text-white ml-2">{property.ownerAddress}</span>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                              
                              {/* Staff Information Row */}
                              <tr className="bg-gray-900">
                                <td></td>
                                <td colSpan={2} className="p-0">
                                  <div className="p-4">
                                    <h5 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                      <User className="h-4 w-4" />
                                      Staff at {property.name}
                                    </h5>
                                    <table className="min-w-full text-sm">
                                      <thead>
                                        <tr className="bg-gray-800 border-b border-gray-700">
                                          <th className="text-left py-2 px-3 font-semibold text-white">Name</th>
                                          <th className="text-left py-2 px-3 font-semibold text-white">Role</th>
                                          <th className="text-left py-2 px-3 font-semibold text-white">Phone</th>
                                          <th className="text-left py-2 px-3 font-semibold text-white">Email</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {property.staff.map((employee, index) => (
                                          <tr key={index} className="bg-gray-900 border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                                            <td className="py-2 px-3 text-gray-300">{employee.name}</td>
                                            <td className="py-2 px-3 text-gray-300">{employee.role}</td>
                                            <td className="py-2 px-3 text-gray-300">{employee.phone}</td>
                                            <td className="py-2 px-3 text-gray-300">{employee.email}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                  </div>
                                </td>
                              </tr>
                            </>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                    </div>
              </>
            )}
            {activeTab === "staff" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-white">Technicians</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-gray-900 border-b border-gray-700">
                        <th className="text-left py-3 px-4 font-semibold text-white">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-white">Phone</th>
                        <th className="text-left py-3 px-4 font-semibold text-white">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-white">Work Orders Assigned</th>
                      </tr>
                    </thead>
                    <tbody>
                      {staff.map((technician) => {
                        const assignedJobs = jobs.filter(job => job.technician === technician.name);
                        return (
                          <React.Fragment key={technician.id}>
                            <tr className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                              <td className="py-3 px-4">
                                <div className="font-medium text-white">{technician.name}</div>
                              </td>
                              <td className="py-3 px-4 text-gray-300">{technician.phone}</td>
                              <td className="py-3 px-4 text-gray-300">{technician.email}</td>
                              <td className="py-3 px-4 text-gray-300">
                                <button
                                  className={`text-left hover:text-blue-400 transition-colors ${
                                    assignedJobs.length > 0 ? 'text-blue-400 cursor-pointer' : 'text-gray-500 cursor-default'
                                  }`}
                                  onClick={() => assignedJobs.length > 0 && setViewTechnicianWorkOrders(viewTechnicianWorkOrders === technician.id ? null : technician.id)}
                                  disabled={assignedJobs.length === 0}
                                >
                                  {assignedJobs.length} work order{assignedJobs.length !== 1 ? 's' : ''}
                                </button>
                              </td>
                            </tr>
                            {viewTechnicianWorkOrders === technician.id && assignedJobs.length > 0 && (
                              <tr className="bg-gray-900">
                                <td colSpan={4} className="p-0">
                                  <div className="p-4">
                                    <h5 className="text-sm font-semibold text-white mb-3">Work Orders for {technician.name}</h5>
                                    <table className="min-w-full text-sm">
                                      <thead>
                                        <tr className="bg-gray-800 border-b border-gray-700">
                                          <th className="text-left py-2 px-3 font-semibold text-white">Property</th>
                                          <th className="text-left py-2 px-3 font-semibold text-white">Description</th>
                                          <th className="text-left py-2 px-3 font-semibold text-white">Status</th>
                                          <th className="text-left py-2 px-3 font-semibold text-white">Priority</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {assignedJobs.map((job) => (
                                          <tr key={job.id} className="bg-gray-900 border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                                            <td className="py-2 px-3 text-gray-300">{job.property}</td>
                                            <td className="py-2 px-3 text-gray-300">{job.description}</td>
                                            <td className="py-2 px-3 text-gray-300">{job.techStatus}</td>
                                            <td className="py-2 px-3 text-gray-300">{job.priority}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
            </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
            {activeTab === "profile" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-white">My Profile</h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Personal Information Card */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                          <User className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white">{technicianName}</h4>
                          <p className="text-gray-400">HVAC Technician</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label className="text-gray-400">Employee ID</Label>
                          <span className="text-white">TECH-001</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <Label className="text-gray-400">Email</Label>
                          <span className="text-white">alice.johnson@company.com</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <Label className="text-gray-400">Phone</Label>
                          <span className="text-white">(555) 123-4567</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <Label className="text-gray-400">Hire Date</Label>
                          <span className="text-white">March 15, 2023</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <Label className="text-gray-400">Status</Label>
                          <Badge className="bg-green-600 text-white">Active</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Work Statistics Card */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Work Statistics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-gray-700 rounded-lg">
                          <div className="text-2xl font-bold text-blue-400">{technicianWorkOrders.length}</div>
                          <div className="text-sm text-gray-400">Total Work Orders</div>
                        </div>
                        <div className="text-center p-3 bg-gray-700 rounded-lg">
                          <div className="text-2xl font-bold text-green-400">{technicianFinishedJobs.length}</div>
                          <div className="text-sm text-gray-400">Completed</div>
                        </div>
                        <div className="text-center p-3 bg-gray-700 rounded-lg">
                          <div className="text-2xl font-bold text-yellow-400">{technicianInProgressJobs.length}</div>
                          <div className="text-sm text-gray-400">In Progress</div>
                        </div>
                        <div className="text-center p-3 bg-gray-700 rounded-lg">
                          <div className="text-2xl font-bold text-red-400">{technicianOverdueJobs.length}</div>
                          <div className="text-sm text-gray-400">Overdue</div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-700">
                        <h5 className="text-sm font-semibold text-white mb-2">This Month's Expenses</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Total Spent</span>
                            <span className="text-white">${technicianTotalSpend.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Billable</span>
                            <span className="text-green-400">${technicianBillableSpend.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Non-Billable</span>
                            <span className="text-yellow-400">${technicianNonBillableSpend.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Skills & Certifications Card */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Skills & Certifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                          <div>
                            <div className="font-medium text-white">HVAC Installation</div>
                            <div className="text-sm text-gray-400">Certified Technician</div>
                          </div>
                          <Badge className="bg-green-600 text-white">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                          <div>
                            <div className="font-medium text-white">Refrigeration Systems</div>
                            <div className="text-sm text-gray-400">EPA Certified</div>
                          </div>
                          <Badge className="bg-green-600 text-white">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                          <div>
                            <div className="font-medium text-white">Electrical Systems</div>
                            <div className="text-sm text-gray-400">Licensed Electrician</div>
                          </div>
                          <Badge className="bg-green-600 text-white">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                          <div>
                            <div className="font-medium text-white">Plumbing</div>
                            <div className="text-sm text-gray-400">Basic Certification</div>
                          </div>
                          <Badge className="bg-yellow-600 text-white">Pending</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Activity Card */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="text-sm text-white">Completed HVAC maintenance at Stanford GSB</p>
                            <p className="text-xs text-gray-400">2 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="text-sm text-white">Started work order at Sunnyvale 432</p>
                            <p className="text-xs text-gray-400">1 day ago</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="text-sm text-white">Submitted expense report for $150.00</p>
                            <p className="text-xs text-gray-400">2 days ago</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="text-sm text-white">Received new work order assignment</p>
                            <p className="text-xs text-gray-400">3 days ago</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
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
                  <SheetTitle className="flex items-center gap-2 text-lg font-semibold text-white"><Sparkles className="h-5 w-5 text-blue-400" /> Smart Assist</SheetTitle>
                  <SheetDescription className="text-gray-400">Ask any question about your properties, jobs, or expenses!</SheetDescription>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto mb-4 space-y-4 bg-gray-800 rounded p-4">
                  {smartAssistChat.length === 0 && (
                    <div className="text-gray-400 text-sm">Ask any question about your properties, jobs, or expenses!</div>
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

            {/* New Work Order Dialog */}
            <Dialog open={newJobDialogOpen} onOpenChange={setNewJobDialogOpen}>
              <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
                <DialogHeader>
                  <DialogTitle>New Work Order</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Fill out the details to create a new work order.
                  </DialogDescription>
                </DialogHeader>
                      <div className="space-y-4">
                  {/* Property Dropdown */}
                  <div>
                    <Label className="text-gray-300">Property</Label>
                    <Select
                      value={newWorkOrder.property}
                      onValueChange={value => setNewWorkOrder(prev => ({ ...prev, property: value }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-full">
                        <SelectValue placeholder="Select property" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        {properties.map(property => (
                          <SelectItem key={property.id} value={property.name} className="bg-gray-900 text-white">
                            {property.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.property && <div className="text-red-400 text-xs mt-1">{formErrors.property}</div>}
                              </div>
                  {/* Work Order Name */}
                  <div>
                    <Label className="text-gray-300">Work Order Name</Label>
                    <Input
                      className="bg-gray-800 border-gray-600 text-white w-full"
                      placeholder="Enter work order name/description"
                      value={newWorkOrder.description}
                      onChange={e => setNewWorkOrder(prev => ({ ...prev, description: e.target.value }))}
                    />
                    {formErrors.description && <div className="text-red-400 text-xs mt-1">{formErrors.description}</div>}
                            </div>
                  {/* Estimated Cost Dropdown */}
                  <div>
                    <Label className="text-gray-300">Estimated Cost</Label>
                    <Select
                      value={newWorkOrder.cost ? (Number(newWorkOrder.cost) >= 1000 ? '1000+' : '<1000') : ''}
                      onValueChange={value => setNewWorkOrder(prev => ({ ...prev, cost: value === '1000+' ? '1000' : '999' }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-full">
                        <SelectValue placeholder="Select estimated cost" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="<1000" className="bg-gray-900 text-white">Less than $1,000</SelectItem>
                        <SelectItem value="1000+" className="bg-gray-900 text-white">$1,000 or more</SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors.cost && <div className="text-red-400 text-xs mt-1">{formErrors.cost}</div>}
                  </div>
                  {/* Priority Dropdown */}
                  <div>
                    <Label className="text-gray-300">Priority</Label>
                    <Select
                      value={newWorkOrder.priority}
                      onValueChange={value => setNewWorkOrder(prev => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-full">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="Low" className="bg-gray-900 text-white">Low</SelectItem>
                        <SelectItem value="Medium" className="bg-gray-900 text-white">Medium</SelectItem>
                        <SelectItem value="High" className="bg-gray-900 text-white">High</SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors.priority && <div className="text-red-400 text-xs mt-1">{formErrors.priority}</div>}
                  </div>
                </div>
                <DialogFooter className="mt-4">
                              <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleCreateWorkOrder}
                  >
                    Create Work Order
                              </Button>
                              <Button
                                variant="outline"
                    className="border-gray-600 text-gray-300"
                    onClick={() => setNewJobDialogOpen(false)}
                  >
                    Cancel
                              </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Edit Work Order Dialog */}
            <Dialog open={editJobDialogOpen} onOpenChange={setEditJobDialogOpen}>
              <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Work Order</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Update the details for this work order.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {/* Property Dropdown */}
                  <div>
                    <Label className="text-gray-300">Property</Label>
                    <Select
                      value={editJobForm.property}
                      onValueChange={value => setEditJobForm(prev => ({ ...prev, property: value }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-full">
                        <SelectValue placeholder="Select property" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        {properties.map(property => (
                          <SelectItem key={property.id} value={property.name} className="bg-gray-900 text-white">
                            {property.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                      </div>
                  {/* Work Order Name */}
                          <div>
                    <Label className="text-gray-300">Work Order Name</Label>
                    <Input
                      className="bg-gray-800 border-gray-600 text-white w-full"
                      placeholder="Enter work order name/description"
                      value={editJobForm.description}
                      onChange={e => setEditJobForm(prev => ({ ...prev, description: e.target.value }))}
                    />
                            </div>
                  {/* Estimated Cost Dropdown */}
                          <div>
                    <Label className="text-gray-300">Estimated Cost</Label>
                    <Select
                      value={editJobForm.cost ? (Number(editJobForm.cost) >= 1000 ? '1000+' : '<1000') : ''}
                      onValueChange={value => setEditJobForm(prev => ({ ...prev, cost: value === '1000+' ? '1000' : '999' }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-full">
                        <SelectValue placeholder="Select estimated cost" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="<1000" className="bg-gray-900 text-white">Less than $1,000</SelectItem>
                        <SelectItem value="1000+" className="bg-gray-900 text-white">$1,000 or more</SelectItem>
                      </SelectContent>
                    </Select>
                            </div>
                  {/* Priority Dropdown */}
                          <div>
                    <Label className="text-gray-300">Priority</Label>
                    <Select
                      value={editJobForm.priority}
                      onValueChange={value => setEditJobForm(prev => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-full">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="Low" className="bg-gray-900 text-white">Low</SelectItem>
                        <SelectItem value="Medium" className="bg-gray-900 text-white">Medium</SelectItem>
                        <SelectItem value="High" className="bg-gray-900 text-white">High</SelectItem>
                      </SelectContent>
                    </Select>
                            </div>
                          </div>
                <DialogFooter className="mt-4">
                        <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleUpdateWorkOrder}
                    disabled={!editJobForm.property || !editJobForm.description}
                  >
                    Update Work Order
                        </Button>
                        <Button 
                          variant="outline" 
                    className="border-gray-600 text-gray-300"
                    onClick={() => setEditJobDialogOpen(false)}
                  >
                    Cancel
                        </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* New Expense Dialog */}
            <Dialog open={newExpenseDialogOpen} onOpenChange={setNewExpenseDialogOpen}>
              <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Expense</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Enter the details for the new expense. It will be added to the "Needs Review" table.
                  </DialogDescription>
                </DialogHeader>
                        <div className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Merchant</Label>
                    <Input 
                      className="bg-gray-800 border-gray-600 text-white" 
                      value={mainExpenseForm.vendor} 
                      onChange={e => setMainExpenseForm(f => ({ ...f, vendor: e.target.value }))} 
                      placeholder="Merchant name" 
                    />
                                  </div>
                  <div>
                    <Label className="text-gray-300">Amount</Label>
                    <Input 
                      className="bg-gray-800 border-gray-600 text-white" 
                      type="number" 
                      value={mainExpenseForm.amount} 
                      onChange={e => setMainExpenseForm(f => ({ ...f, amount: e.target.value }))} 
                      placeholder="Amount" 
                    />
                                    </div>
                  <div>
                    <Label className="text-gray-300">Made By</Label>
                    <Input 
                      className="bg-gray-800 border-gray-600 text-white" 
                      value={mainExpenseForm.madeBy} 
                      onChange={e => setMainExpenseForm(f => ({ ...f, madeBy: e.target.value }))} 
                      placeholder="Name" 
                    />
                                  </div>
                  <div>
                    <Label className="text-gray-300">Billable</Label>
                    <Select value={mainExpenseForm.billable ? 'yes' : 'no'} onValueChange={v => setMainExpenseForm(f => ({ ...f, billable: v === 'yes' }))}>
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
                    <Input 
                      className="bg-gray-800 border-gray-600 text-white" 
                      value={mainExpenseForm.memo} 
                      onChange={e => setMainExpenseForm(f => ({ ...f, memo: e.target.value }))} 
                      placeholder="Memo" 
                    />
                              </div>
                  <div>
                    <Label className="text-gray-300">Receipt</Label>
                    <Input 
                                    className="bg-gray-800 border-gray-600 text-white"
                      type="file" 
                      onChange={e => setMainExpenseForm(f => ({ ...f, receipt: e.target.files?.[0]?.name || '' }))} 
                    />
                    {mainExpenseForm.receipt && <span className="text-xs text-green-400">{mainExpenseForm.receipt}</span>}
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setNewExpenseDialogOpen(false)} className="border-gray-600 text-gray-300">
                    Cancel
                  </Button>
                                    <Button
                    className="bg-blue-600 hover:bg-blue-700" 
                    disabled={!mainExpenseForm.vendor || !mainExpenseForm.amount || !mainExpenseForm.madeBy} 
                                      onClick={() => {
                      // Add new expense to transactions with pending status
                      const newExpense: Transaction = {
                        id: `txn-${Date.now()}`,
                        date: new Date().toISOString().split('T')[0],
                        vendor: mainExpenseForm.vendor,
                        amount: Number(mainExpenseForm.amount),
                        status: 'pending',
                        billable: mainExpenseForm.billable,
                        jobId: '', // No job assigned initially
                        madeBy: mainExpenseForm.madeBy,
                        memo: mainExpenseForm.memo,
                        receipt: mainExpenseForm.receipt
                      };
                      
                      setTransactions(prev => [...prev, newExpense]);
                      setNewExpenseDialogOpen(false);
                      setMainExpenseForm({ vendor: '', amount: '', madeBy: '', billable: true, memo: '', receipt: '' });
                    }}
                  >
                    Add Expense
                                    </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Transaction Details Dialog */}
            <Dialog open={transactionDetailsOpen} onOpenChange={setTransactionDetailsOpen}>
              <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
                <DialogHeader>
                  <DialogTitle>Transaction Details</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    View the details for this transaction.
                  </DialogDescription>
                </DialogHeader>
                {selectedTransaction ? (
                  <div className="space-y-2">
                    <div><b>Date:</b> {selectedTransaction.date}</div>
                    <div><b>Merchant:</b> {selectedTransaction.vendor}</div>
                    <div><b>Amount:</b> ${selectedTransaction.amount.toFixed(2)}</div>
                    <div><b>Made By:</b> {selectedTransaction.madeBy}</div>
                    <div><b>Status:</b> {selectedTransaction.status}</div>
                    <div><b>Billable:</b> {selectedTransaction.billable ? 'Yes' : 'No'}</div>
                    <div><b>Memo:</b> {selectedTransaction.memo || '-'}</div>
                    <div><b>Receipt:</b> {selectedTransaction.receipt ? (
                      <a
                        href={`/receipts/${selectedTransaction.receipt}`}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 underline hover:text-blue-200"
                      >
                        Download Receipt
                      </a>
                    ) : (
                      '-'
                    )}
                                  </div>
                                </div>
                ) : (
                  <div>No transaction selected.</div>
                )}
              </DialogContent>
            </Dialog>

            {/* New Transaction Dialog - Central Office Only */}
            <Dialog open={newTransactionDialogOpen} onOpenChange={setNewTransactionDialogOpen}>
              <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Transaction</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Manually add a new transaction to the system.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Date</Label>
                    <Input
                      type="date"
                      className="bg-gray-800 border-gray-600 text-white"
                      value={newTransactionForm.date}
                      onChange={e => setNewTransactionForm(prev => ({ ...prev, date: e.target.value }))}
                    />
                                  </div>
                  <div>
                    <Label className="text-gray-300">Vendor/Merchant</Label>
                    <Input
                      className="bg-gray-800 border-gray-600 text-white"
                      value={newTransactionForm.vendor}
                      onChange={e => setNewTransactionForm(prev => ({ ...prev, vendor: e.target.value }))}
                      placeholder="Merchant name"
                    />
                                </div>
                  <div>
                    <Label className="text-gray-300">Amount</Label>
                    <Input
                      type="number"
                      step="0.01"
                      className="bg-gray-800 border-gray-600 text-white"
                      value={newTransactionForm.amount}
                      onChange={e => setNewTransactionForm(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="0.00"
                    />
                            </div>
                  <div>
                    <Label className="text-gray-300">Made By</Label>
                    <Input
                      className="bg-gray-800 border-gray-600 text-white"
                      value={newTransactionForm.madeBy}
                      onChange={e => setNewTransactionForm(prev => ({ ...prev, madeBy: e.target.value }))}
                      placeholder="Person name"
                    />
                        </div>
                  <div>
                    <Label className="text-gray-300">Card Holder</Label>
                    <Input
                      className="bg-gray-800 border-gray-600 text-white"
                      value={newTransactionForm.cardHolder}
                      onChange={e => setNewTransactionForm(prev => ({ ...prev, cardHolder: e.target.value }))}
                      placeholder="Card holder name"
                    />
                </div>
                  <div>
                    <Label className="text-gray-300">Property</Label>
                    <Select
                      value={newTransactionForm.property}
                      onValueChange={value => setNewTransactionForm(prev => ({ ...prev, property: value }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="Select property" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        {properties.map(property => (
                          <SelectItem key={property.id} value={property.name} className="bg-gray-900 text-white">
                            {property.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
              </div>
                  <div>
                    <Label className="text-gray-300">Work Order (Optional)</Label>
                    <Select
                      value={newTransactionForm.job}
                      onValueChange={value => setNewTransactionForm(prev => ({ ...prev, job: value }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="Select work order" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="none" className="bg-gray-900 text-white">No work order</SelectItem>
                        {jobs.map(job => (
                          <SelectItem key={job.id} value={job.id} className="bg-gray-900 text-white">
                            {job.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    </div>
                  <div>
                    <Label className="text-gray-300">Billable</Label>
                    <Select
                      value={newTransactionForm.billable ? 'yes' : 'no'}
                      onValueChange={value => setNewTransactionForm(prev => ({ ...prev, billable: value === 'yes' }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="yes" className="bg-gray-900 text-white">Yes</SelectItem>
                        <SelectItem value="no" className="bg-gray-900 text-white">No</SelectItem>
                      </SelectContent>
                    </Select>
            </div>
                  <div className="col-span-2">
                    <Label className="text-gray-300">Memo</Label>
                    <Input
                      className="bg-gray-800 border-gray-600 text-white"
                      value={newTransactionForm.memo}
                      onChange={e => setNewTransactionForm(prev => ({ ...prev, memo: e.target.value }))}
                      placeholder="Transaction description/memo"
                    />
                </div>
                  <div className="col-span-2">
                    <Label className="text-gray-300">Receipt</Label>
                    <Input
                      type="file"
                      accept="image/*,application/pdf"
                      className="bg-gray-800 border-gray-600 text-white"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        setNewTransactionForm(prev => ({ ...prev, receipt: file ? file.name : '' }));
                      }}
                    />
                    {newTransactionForm.receipt && (
                      <span className="text-xs text-green-400 mt-1">{newTransactionForm.receipt}</span>
                    )}
                </div>
                </div>
                <DialogFooter className="mt-4">
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleCreateNewTransaction}
                    disabled={!newTransactionForm.date || !newTransactionForm.vendor || !newTransactionForm.amount || !newTransactionForm.madeBy || !newTransactionForm.cardHolder || !newTransactionForm.property || !newTransactionForm.memo}
                  >
                    Create Transaction
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                    onClick={() => setNewTransactionDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Edit Transaction Dialog - Central Office Only */}
            <Dialog open={editTransactionDialogOpen} onOpenChange={setEditTransactionDialogOpen}>
              <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit Transaction</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Edit the details of this transaction.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Date</Label>
                    <Input
                      type="date"
                      className="bg-gray-800 border-gray-600 text-white"
                      value={editTransactionForm.date}
                      onChange={e => setEditTransactionForm(prev => ({ ...prev, date: e.target.value }))}
                    />
                        </div>
                        <div>
                    <Label className="text-gray-300">Vendor/Merchant</Label>
                    <Input
                      className="bg-gray-800 border-gray-600 text-white"
                      value={editTransactionForm.vendor}
                      onChange={e => setEditTransactionForm(prev => ({ ...prev, vendor: e.target.value }))}
                      placeholder="Merchant name"
                    />
                        </div>
                  <div>
                    <Label className="text-gray-300">Amount</Label>
                    <Input
                      type="number"
                      step="0.01"
                      className="bg-gray-800 border-gray-600 text-white"
                      value={editTransactionForm.amount}
                      onChange={e => setEditTransactionForm(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="0.00"
                    />
                      </div>
                  <div>
                    <Label className="text-gray-300">Made By</Label>
                    <Input
                      className="bg-gray-800 border-gray-600 text-white"
                      value={editTransactionForm.madeBy}
                      onChange={e => setEditTransactionForm(prev => ({ ...prev, madeBy: e.target.value }))}
                      placeholder="Person name"
                    />
                        </div>
                  <div>
                    <Label className="text-gray-300">Card Holder</Label>
                    <Input
                      className="bg-gray-800 border-gray-600 text-white"
                      value={editTransactionForm.cardHolder}
                      onChange={e => setEditTransactionForm(prev => ({ ...prev, cardHolder: e.target.value }))}
                      placeholder="Card holder name"
                    />
                        </div>
                  <div>
                    <Label className="text-gray-300">Property</Label>
                    <Select
                      value={editTransactionForm.property}
                      onValueChange={value => setEditTransactionForm(prev => ({ ...prev, property: value }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="Select property" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        {properties.map(property => (
                          <SelectItem key={property.id} value={property.name} className="bg-gray-900 text-white">
                            {property.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                        </div>
                  <div>
                    <Label className="text-gray-300">Work Order (Optional)</Label>
                    <Select
                      value={editTransactionForm.job}
                      onValueChange={value => setEditTransactionForm(prev => ({ ...prev, job: value }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="Select work order" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="none" className="bg-gray-900 text-white">No work order</SelectItem>
                        {jobs.map(job => (
                          <SelectItem key={job.id} value={job.id} className="bg-gray-900 text-white">
                            {job.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                        </div>
                  <div>
                    <Label className="text-gray-300">Billable</Label>
                    <Select
                      value={editTransactionForm.billable ? 'yes' : 'no'}
                      onValueChange={value => setEditTransactionForm(prev => ({ ...prev, billable: value === 'yes' }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="yes" className="bg-gray-900 text-white">Yes</SelectItem>
                        <SelectItem value="no" className="bg-gray-900 text-white">No</SelectItem>
                      </SelectContent>
                    </Select>
                        </div>
                  <div className="col-span-2">
                    <Label className="text-gray-300">Memo</Label>
                    <Input
                      className="bg-gray-800 border-gray-600 text-white"
                      value={editTransactionForm.memo}
                      onChange={e => setEditTransactionForm(prev => ({ ...prev, memo: e.target.value }))}
                      placeholder="Transaction description/memo"
                    />
                      </div>
                  <div className="col-span-2">
                    <Label className="text-gray-300">Receipt</Label>
                    <Input
                      type="file"
                      accept="image/*,application/pdf"
                      className="bg-gray-800 border-gray-600 text-white"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        setEditTransactionForm(prev => ({ ...prev, receipt: file ? file.name : '' }));
                      }}
                    />
                    {editTransactionForm.receipt && (
                      <span className="text-xs text-green-400 mt-1">{editTransactionForm.receipt}</span>
                    )}
                        </div>
                        </div>
                <DialogFooter className="mt-4">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleUpdateTransaction}
                    disabled={!editTransactionForm.date || !editTransactionForm.vendor || !editTransactionForm.amount || !editTransactionForm.madeBy || !editTransactionForm.cardHolder || !editTransactionForm.property || !editTransactionForm.memo}
                  >
                    Update Transaction
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                    onClick={() => setEditTransactionDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Add New Question Dialog - Policy Tab */}
            <Dialog open={newQuestionDialogOpen} onOpenChange={setNewQuestionDialogOpen}>
              <DialogContent className="bg-gray-900 border-gray-700 text-white">
                <DialogHeader>
                  <DialogTitle>Add New Expense Question</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Add a new question to the expense decision tracker.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Question</Label>
                    <Textarea
                      className="bg-gray-800 border-gray-600 text-white"
                      value={newQuestion.question}
                      onChange={e => setNewQuestion(prev => ({ ...prev, question: e.target.value }))}
                      placeholder="Enter the expense question..."
                      rows={3}
                    />
                          </div>
                  <div>
                    <Label className="text-gray-300">Category</Label>
                    <Select
                      value={newQuestion.category}
                      onValueChange={value => setNewQuestion(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="General" className="bg-gray-900 text-white">General</SelectItem>
                        <SelectItem value="Categorization" className="bg-gray-900 text-white">Categorization</SelectItem>
                        <SelectItem value="Documentation" className="bg-gray-900 text-white">Documentation</SelectItem>
                        <SelectItem value="Approval" className="bg-gray-900 text-white">Approval</SelectItem>
                        <SelectItem value="Emergency" className="bg-gray-900 text-white">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                          </div>
                          </div>
                <DialogFooter className="mt-4">
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      if (newQuestion.question.trim()) {
                        setExpenseQuestions(prev => [
                          ...prev,
                          {
                            id: Math.max(...prev.map(q => q.id)) + 1,
                            question: newQuestion.question.trim(),
                            answer: null,
                            timestamp: null,
                            category: newQuestion.category
                          }
                        ]);
                        setNewQuestion({ question: '', category: 'General' });
                        setNewQuestionDialogOpen(false);
                      }
                    }}
                    disabled={!newQuestion.question.trim()}
                  >
                    Add Question
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                    onClick={() => {
                      setNewQuestion({ question: '', category: 'General' });
                      setNewQuestionDialogOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Help Request Dialog - Technician to Central Office */}
            <Dialog open={helpRequestDialogOpen} onOpenChange={setHelpRequestDialogOpen}>
              <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Ask Central Office for Help</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Submit a question about expense policies or categorization. The central office will review and respond.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                          <div>
                    <Label className="text-gray-300">Related Expense (Optional)</Label>
                    <Select
                      value={helpRequestForm.expenseId}
                      onValueChange={value => setHelpRequestForm(prev => ({ ...prev, expenseId: value }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="Select an expense (optional)" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="none" className="bg-gray-900 text-white">No specific expense</SelectItem>
                        {[...transactions, ...technicianTransactions]
                          .filter(txn => txn.cardHolder === technicianName)
                          .map(txn => (
                            <SelectItem key={txn.id} value={txn.id} className="bg-gray-900 text-white">
                              {txn.date} - {txn.vendor} - ${txn.amount.toFixed(2)}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                          </div>
                          <div>
                    <Label className="text-gray-300">Your Question *</Label>
                    <Textarea
                      className="bg-gray-800 border-gray-600 text-white"
                      value={helpRequestForm.question}
                      onChange={e => setHelpRequestForm(prev => ({ ...prev, question: e.target.value }))}
                      placeholder="What would you like to ask about this expense or expense policy?"
                      rows={4}
                    />
                          </div>
                          <div>
                    <Label className="text-gray-300">Urgency Level</Label>
                    <Select
                      value={helpRequestForm.urgency}
                      onValueChange={value => setHelpRequestForm(prev => ({ ...prev, urgency: value as 'low' | 'normal' | 'high' }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="low" className="bg-gray-900 text-white">Low - General question</SelectItem>
                        <SelectItem value="normal" className="bg-gray-900 text-white">Normal - Need guidance</SelectItem>
                        <SelectItem value="high" className="bg-gray-900 text-white">High - Urgent decision needed</SelectItem>
                      </SelectContent>
                    </Select>
                          </div>
                          <div>
                    <Label className="text-gray-300">Additional Details</Label>
                    <Textarea
                      className="bg-gray-800 border-gray-600 text-white"
                      value={helpRequestForm.additionalDetails}
                      onChange={e => setHelpRequestForm(prev => ({ ...prev, additionalDetails: e.target.value }))}
                      placeholder="Any additional context or details that might help..."
                      rows={3}
                    />
                          </div>
                        </div>
                <DialogFooter className="mt-4">
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      if (helpRequestForm.question.trim()) {
                        const newRequest = {
                          id: `help_${Date.now()}`,
                          expenseId: helpRequestForm.expenseId,
                          technicianName: technicianName,
                          question: helpRequestForm.question.trim(),
                          urgency: helpRequestForm.urgency as 'low' | 'normal' | 'high',
                          additionalDetails: helpRequestForm.additionalDetails,
                          status: 'pending' as const,
                          createdAt: new Date().toISOString()
                        };
                        setHelpRequests(prev => [newRequest, ...prev]);
                        setHelpRequestForm({
                          expenseId: 'none',
                          question: '',
                          urgency: 'normal',
                          additionalDetails: ''
                        });
                        setHelpRequestDialogOpen(false);
                      }
                    }}
                    disabled={!helpRequestForm.question.trim()}
                  >
                    Submit Help Request
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                    onClick={() => {
                      setHelpRequestForm({
                        expenseId: 'none',
                        question: '',
                        urgency: 'normal',
                        additionalDetails: ''
                      });
                      setHelpRequestDialogOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Help Request Response Dialog - Central Office Response */}
            <Dialog open={responseDialogOpen} onOpenChange={setResponseDialogOpen}>
              <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Respond to Help Request</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Review the technician's question and provide guidance.
                  </DialogDescription>
                </DialogHeader>
                
                {selectedHelpRequest && (
                  <div className="space-y-4">
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h4 className="text-lg font-semibold text-white mb-2">Question from {selectedHelpRequest.technicianName}</h4>
                      <div className="text-gray-300 mb-2">{selectedHelpRequest.question}</div>
                      {selectedHelpRequest.additionalDetails && (
                        <div className="text-sm text-gray-400">
                          <strong>Additional Details:</strong> {selectedHelpRequest.additionalDetails}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label className="text-gray-300">Your Response</Label>
                      <Textarea
                        className="bg-gray-800 border-gray-600 text-white mt-1"
                        value={responseForm.answer}
                        onChange={e => setResponseForm(prev => ({ ...prev, answer: e.target.value }))}
                        placeholder="Provide your guidance and decision to the technician..."
                        rows={4}
                      />
                    </div>
                  </div>
                )}

                <DialogFooter className="mt-6">
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      if (selectedHelpRequest && responseForm.answer.trim()) {
                        setHelpRequests(prev => prev.map(req => 
                          req.id === selectedHelpRequest.id 
                            ? {
                                ...req,
                                status: 'answered',
                                answer: responseForm.answer.trim(),
                                answeredAt: new Date().toISOString()
                              }
                            : req
                        ));
                        setResponseForm({ 
                          answer: '', 
                          decisionTrackerAnswers: {
                            'Is this expense reasonable and necessary?': null,
                            'Should this be billable to the property/owner?': null,
                            'Is a receipt required?': null,
                            'Does this require pre-approval?': null,
                            'Is this an emergency repair?': null,
                            'Is this a capital improvement?': null,
                            'Should this be reimbursed?': null,
                            'Is this within budget limits?': null
                          }
                        });
                        setSelectedHelpRequest(null);
                        setResponseDialogOpen(false);
                      }
                    }}
                    disabled={!responseForm.answer.trim()}
                  >
                    Send Response
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                    onClick={() => {
                      setResponseForm({ 
                        answer: '', 
                        decisionTrackerAnswers: {
                          'Is this expense reasonable and necessary?': null,
                          'Should this be billable to the property/owner?': null,
                          'Is a receipt required?': null,
                          'Does this require pre-approval?': null,
                          'Is this an emergency repair?': null,
                          'Is this a capital improvement?': null,
                          'Should this be reimbursed?': null,
                          'Is this within budget limits?': null
                        }
                      });
                      setSelectedHelpRequest(null);
                      setResponseDialogOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Issue New Card Dialog */}
            <Dialog open={issueCardDialogOpen} onOpenChange={setIssueCardDialogOpen}>
              <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Issue New Card</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Create a new virtual or physical card with limits and restrictions.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">Card Type</Label>
                      <Select
                        value={cardForm.type}
                        onValueChange={value => setCardForm(prev => ({ ...prev, type: value as CardType }))}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700 text-white">
                          <SelectItem value="virtual" className="bg-gray-900 text-white">Virtual Card</SelectItem>
                          <SelectItem value="physical" className="bg-gray-900 text-white">Physical Card</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300">Card Holder Name</Label>
                      <Input
                        className="bg-gray-800 border-gray-600 text-white"
                        value={cardForm.holder}
                        onChange={e => setCardForm(prev => ({ ...prev, holder: e.target.value }))}
                        placeholder="Enter cardholder name"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">Position</Label>
                      <Select
                        value={cardForm.position}
                        onValueChange={value => setCardForm(prev => ({ ...prev, position: value as EnhancedCard['position'] }))}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700 text-white">
                          <SelectItem value="Technician" className="bg-gray-900 text-white">Technician</SelectItem>
                          <SelectItem value="PM" className="bg-gray-900 text-white">Property Manager</SelectItem>
                          <SelectItem value="Super" className="bg-gray-900 text-white">Superintendent</SelectItem>
                          <SelectItem value="Admin" className="bg-gray-900 text-white">Administrator</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300">Credit Limit</Label>
                      <Input
                        type="number"
                        className="bg-gray-800 border-gray-600 text-white"
                        value={cardForm.limit}
                        onChange={e => setCardForm(prev => ({ ...prev, limit: e.target.value }))}
                        placeholder="Enter credit limit"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-300">Assigned Properties</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {properties.map(property => (
                        <label key={property.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={cardForm.assignedProperties.includes(property.id)}
                            onChange={e => {
                              if (e.target.checked) {
                                setCardForm(prev => ({ 
                                  ...prev, 
                                  assignedProperties: [...prev.assignedProperties, property.id] 
                                }));
                              } else {
                                setCardForm(prev => ({ 
                                  ...prev, 
                                  assignedProperties: prev.assignedProperties.filter(id => id !== property.id) 
                                }));
                              }
                            }}
                            className="rounded"
                          />
                          <span className="text-gray-300 text-sm">{property.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-300">Vendor Restrictions</Label>
                    <Textarea
                      className="bg-gray-800 border-gray-600 text-white"
                      value={cardForm.vendorRestrictions.join(', ')}
                      onChange={e => setCardForm(prev => ({ 
                        ...prev, 
                        vendorRestrictions: e.target.value.split(',').map(v => v.trim()).filter(v => v) 
                      }))}
                      placeholder="Home Depot, Lowes, Office Depot (comma-separated)"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Card Brand</Label>
                    <Select
                      value={cardForm.brand}
                      onValueChange={value => setCardForm(prev => ({ ...prev, brand: value as EnhancedCard['brand'] }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="Chase" className="bg-gray-900 text-white">Chase</SelectItem>
                        <SelectItem value="Amex" className="bg-gray-900 text-white">American Express</SelectItem>
                        <SelectItem value="Visa" className="bg-gray-900 text-white">Visa</SelectItem>
                        <SelectItem value="Mastercard" className="bg-gray-900 text-white">Mastercard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleIssueNewCard}
                    disabled={!cardForm.holder || !cardForm.limit || cardForm.assignedProperties.length === 0}
                  >
                    Issue Card
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                    onClick={() => setIssueCardDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Connect Existing Card Dialog */}
            <Dialog open={connectCardDialogOpen} onOpenChange={setConnectCardDialogOpen}>
              <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Connect Existing Card</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Connect an existing Amex, Visa, or other card to your property management system.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">Existing Card Type</Label>
                      <Select
                        value={cardForm.type}
                        onValueChange={value => setCardForm(prev => ({ ...prev, type: value as CardType }))}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700 text-white">
                          <SelectItem value="virtual" className="bg-gray-900 text-white">Virtual Card</SelectItem>
                          <SelectItem value="physical" className="bg-gray-900 text-white">Physical Card</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300">Card Holder Name</Label>
                      <Input
                        className="bg-gray-800 border-gray-600 text-white"
                        value={cardForm.holder}
                        onChange={e => setCardForm(prev => ({ ...prev, holder: e.target.value }))}
                        placeholder="Name on existing card"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">Position</Label>
                      <Select
                        value={cardForm.position}
                        onValueChange={value => setCardForm(prev => ({ ...prev, position: value as EnhancedCard['position'] }))}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700 text-white">
                          <SelectItem value="Technician" className="bg-gray-900 text-white">Technician</SelectItem>
                          <SelectItem value="PM" className="bg-gray-900 text-white">Property Manager</SelectItem>
                          <SelectItem value="Super" className="bg-gray-900 text-white">Superintendent</SelectItem>
                          <SelectItem value="Admin" className="bg-gray-900 text-white">Administrator</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300">Current Credit Limit</Label>
                      <Input
                        type="number"
                        className="bg-gray-800 border-gray-600 text-white"
                        value={cardForm.limit}
                        onChange={e => setCardForm(prev => ({ ...prev, limit: e.target.value }))}
                        placeholder="Enter current limit"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-300">Existing Card Brand</Label>
                    <Select
                      value={cardForm.brand}
                      onValueChange={value => setCardForm(prev => ({ ...prev, brand: value as EnhancedCard['brand'] }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="Amex" className="bg-gray-900 text-white">American Express</SelectItem>
                        <SelectItem value="Chase" className="bg-gray-900 text-white">Chase</SelectItem>
                        <SelectItem value="Visa" className="bg-gray-900 text-white">Visa</SelectItem>
                        <SelectItem value="Mastercard" className="bg-gray-900 text-white">Mastercard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-300">Assign to Properties</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {properties.map(property => (
                        <label key={property.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={cardForm.assignedProperties.includes(property.id)}
                            onChange={e => {
                              if (e.target.checked) {
                                setCardForm(prev => ({ 
                                  ...prev, 
                                  assignedProperties: [...prev.assignedProperties, property.id] 
                                }));
                              } else {
                                setCardForm(prev => ({ 
                                  ...prev, 
                                  assignedProperties: prev.assignedProperties.filter(id => id !== property.id) 
                                }));
                              }
                            }}
                            className="rounded"
                          />
                          <span className="text-gray-300 text-sm">{property.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-300">Vendor Restrictions</Label>
                    <Textarea
                      className="bg-gray-800 border-gray-600 text-white"
                      value={cardForm.vendorRestrictions.join(', ')}
                      onChange={e => setCardForm(prev => ({ 
                        ...prev, 
                        vendorRestrictions: e.target.value.split(',').map(v => v.trim()).filter(v => v) 
                      }))}
                      placeholder="Home Depot, Lowes, Office Depot (comma-separated)"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleConnectExistingCard}
                    disabled={!cardForm.holder || !cardForm.limit || cardForm.assignedProperties.length === 0}
                  >
                    Connect Card
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                    onClick={() => setConnectCardDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Monthly Reimbursement Dialog */}
            <Dialog open={monthlyReimbursementDialogOpen} onOpenChange={setMonthlyReimbursementDialogOpen}>
              <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-6xl max-h-[95vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl">Process Monthly GL Report Reimbursement</DialogTitle>
                  <DialogDescription>
                    Generate GL-coded expense report and process reimbursement with AppFolio sync
                  </DialogDescription>
                </DialogHeader>
                
                {selectedPropertyForMonthly && (
                  <div className="space-y-6">
                    {/* Property & Month Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="bg-gray-800 border-gray-700">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm text-blue-400">Property & Month</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div>
                            <div className="text-sm text-gray-400">Property</div>
                            <div className="font-medium text-white">{selectedPropertyForMonthly.name}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-400">Report Month</div>
                            <div className="text-sm text-gray-300">{new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-400">AppFolio Sync</div>
                            <div className="text-sm text-green-400 flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              Active
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gray-800 border-gray-700">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm text-blue-400">Trust Account Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div>
                            <div className="text-sm text-gray-400">Bank</div>
                            <div className="font-medium text-white">{selectedPropertyForMonthly.trustAccount.bankName}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-400">Account</div>
                            <div className="text-sm text-gray-300">{selectedPropertyForMonthly.trustAccount.accountNumber}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-400">Routing</div>
                            <div className="text-sm text-gray-300">{selectedPropertyForMonthly.trustAccount.routingNumber}</div>
                          </div>
                          <div className="text-xs text-green-400 mt-2">
                            🔄 Auto-mapping enabled
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Owner Information - Report Recipient */}
                    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-green-300 mb-3 flex items-center gap-2">
                        📧 Report Recipient (Owner)
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Name:</span>
                          <span className="text-white ml-2 font-medium">{selectedPropertyForMonthly.ownerName}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Email:</span>
                          <span className="text-green-300 ml-2">{selectedPropertyForMonthly.ownerEmail}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Phone:</span>
                          <span className="text-white ml-2">{selectedPropertyForMonthly.ownerPhone}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Preferred Contact:</span>
                          <span className="text-yellow-300 ml-2 capitalize">{selectedPropertyForMonthly.ownerPreferredContact}</span>
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-green-400">
                        ✉️ This GL report will be automatically sent to the property owner above
                      </div>
                    </div>

                    {/* CC Recipient */}
                    <div>
                      <Label className="text-gray-300">CC Additional Recipient on GL Report (Optional)</Label>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <Input
                          className="bg-gray-800 border-gray-600 text-white"
                          placeholder="Recipient name"
                          value={ccRecipient.name}
                          onChange={e => setCcRecipient(prev => ({ ...prev, name: e.target.value }))}
                        />
                        <Input
                          type="email"
                          className="bg-gray-800 border-gray-600 text-white"
                          placeholder="recipient@email.com"
                          value={ccRecipient.email}
                          onChange={e => setCcRecipient(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                    </div>

                    {/* GL Report Preview */}
                    <div>
                      <Label className="text-gray-300 mb-3 block">📊 GL Report Preview</Label>
                      <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
                        <div className="mb-3">
                          <h4 className="text-sm font-semibold text-white mb-1">Monthly GL-Coded Expense Report</h4>
                          <div className="text-xs text-gray-400">
                            {selectedPropertyForMonthly.name} • {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </div>
                        </div>
                        
                        {/* Trust Account Details */}
                        <div className="mb-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded">
                          <div className="text-sm text-blue-300 flex items-center gap-2 mb-2">
                            <span className="text-blue-400">🏦</span>
                            Trust Account Details
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-gray-300">
                            <div>
                              <span className="text-gray-400">Bank:</span>
                              <span className="ml-2">{selectedPropertyForMonthly.trustAccount.bankName}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Account:</span>
                              <span className="ml-2">{selectedPropertyForMonthly.trustAccount.accountNumber}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Routing:</span>
                              <span className="ml-2">{selectedPropertyForMonthly.trustAccount.routingNumber}</span>
                            </div>
                          </div>
                        </div>

                        <div className="max-h-64 overflow-y-auto border border-gray-600 rounded">
                          <TooltipProvider>
                            <table className="min-w-full text-xs">
                              <thead className="sticky top-0 bg-gray-900 border-b border-gray-600">
                                <tr>
                                  <th className="text-left py-2 px-3 text-gray-400">Date</th>
                                  <th className="text-left py-2 px-3 text-gray-400">Merchant</th>
                                  <th className="text-left py-2 px-3 text-gray-400">GL Code</th>
                                  <th className="text-left py-2 px-3 text-gray-400">Property Code</th>
                                  <th className="text-left py-2 px-3 text-gray-400">Billable?</th>
                                  <th className="text-left py-2 px-3 text-gray-400">
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <span className="cursor-help">Flag spend</span>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <div>
                                          <div className="text-sm font-semibold">Auto-flagged spend that triggered owner's approval threshold</div>
                                          <div className="text-xs text-gray-400">
                                            Expenses over $500 require pre-approval
                                          </div>
                                        </div>
                                      </TooltipContent>
                                    </Tooltip>
                                  </th>
                                  <th className="text-left py-2 px-3 text-gray-400">Memo/Notes</th>
                                  <th className="text-left py-2 px-3 text-gray-400">Receipt</th>
                                  <th className="text-right py-2 px-3 text-gray-400">Amount</th>
                                </tr>
                              </thead>
                            <tbody>
                              {(() => {
                                // Generate sample transactions for the selected month
                                const sampleTransactions = [
                                  {
                                    date: '2025-01-15',
                                    vendor: 'Home Depot',
                                    amount: 750.00,
                                    billable: true,
                                    memo: 'Owner-approved, HVAC repair parts',
                                    receipt: '[Link]'
                                  },
                                  {
                                    date: '2025-01-16',
                                    vendor: 'Lowes',
                                    amount: 275.50,
                                    billable: true,
                                    memo: 'Paint supplies',
                                    receipt: '[Link]'
                                  },
                                  {
                                    date: '2025-01-17',
                                    vendor: 'Office Depot',
                                    amount: 625.75,
                                    billable: false,
                                    memo: 'Owner-approved, Office supplies',
                                    receipt: '[Link]'
                                  },
                                  {
                                    date: '2025-01-18',
                                    vendor: 'Ace Hardware',
                                    amount: 345.25,
                                    billable: true,
                                    memo: 'Plumbing tools',
                                    receipt: '[Link]'
                                  },
                                  {
                                    date: '2025-01-19',
                                    vendor: 'Sherwin Williams',
                                    amount: 189.99,
                                    billable: true,
                                    memo: 'Interior paint',
                                    receipt: '[Link]'
                                  }
                                ];
                                
                                return sampleTransactions.map((txn, idx) => {
                                  const glCode = txn.billable ? '7200 - Repairs & Maintenance' : '6100 - Office Expenses';
                                  const propertyCode = selectedPropertyForMonthly.id.toUpperCase();
                                  
                                  // Demo flagging logic - flag specific items for demo purposes
                                  const shouldBeFlagged = txn.amount >= 500 || txn.vendor === 'Home Depot' || (txn.memo && txn.memo.includes('HVAC'));
                                  
                                  return (
                                    <tr key={idx} className="border-b border-gray-700 hover:bg-gray-700/30">
                                      <td className="py-2 px-3 text-gray-300">{txn.date}</td>
                                      <td className="py-2 px-3 text-gray-300">{txn.vendor}</td>
                                      <td className="py-2 px-3 text-blue-300">{glCode}</td>
                                      <td className="py-2 px-3 text-purple-300">{propertyCode}</td>
                                      <td className="py-2 px-3">
                                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs ${
                                          txn.billable ? 'bg-green-700 text-green-100' : 'bg-gray-700 text-gray-200'
                                        }`}>
                                          {txn.billable ? 'Yes' : 'No'}
                                        </span>
                                      </td>
                                      <td className="py-2 px-3">
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <span className="cursor-help">
                                                {shouldBeFlagged ? (
                                                  <Badge className="bg-orange-700 text-orange-100 text-xs flex items-center gap-1">
                                                    <Flag className="h-4 w-4" />
                                                    Flagged
                                                  </Badge>
                                                ) : (
                                                  <Badge className="bg-gray-700 text-gray-300 text-xs flex items-center gap-1">
                                                    <CheckCircle className="h-4 w-4" />
                                                    Clear
                                                  </Badge>
                                                )}
                                              </span>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              {shouldBeFlagged ? (
                                                <div>
                                                  <div className="text-sm font-semibold">Auto-flagged spend that triggered owner's threshold for approval</div>
                                                  <div className="text-xs text-gray-400">
                                                    {txn.amount >= 500 ? 'Amount exceeds $500 threshold' : ''}
                                                    {txn.vendor === 'Home Depot' ? 'High-spend vendor flagged' : ''}
                                                    {txn.memo && txn.memo.includes('HVAC') ? 'HVAC expenses require approval' : ''}
                                                  </div>
                                                </div>
                                              ) : (
                                                <div className="text-sm">No flags - approved for processing</div>
                                              )}
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      </td>
                                      <td className="py-2 px-3 text-gray-300">{txn.memo}</td>
                                      <td className="py-2 px-3">
                                        <span className="text-blue-400 cursor-pointer hover:text-blue-300">{txn.receipt}</span>
                                      </td>
                                      <td className="py-2 px-3 text-right text-gray-300">${txn.amount.toFixed(2)}</td>
                                    </tr>
                                  );
                                });
                              })()}
                            </tbody>
                            <tfoot className="bg-gray-900 border-t border-gray-600">
                              <tr>
                                <td colSpan={8} className="py-2 px-3 text-right font-semibold text-gray-300">Total:</td>
                                <td className="py-2 px-3 text-right font-semibold text-white">$2,186.49</td>
                              </tr>
                            </tfoot>
                            </table>
                          </TooltipProvider>
                        </div>
                        
                        <div className="mt-3 text-xs text-gray-400">
                          * This is a preview of the GL report that will be generated and sent to the owner
                        </div>
                      </div>
                    </div>

                    {/* Process Information */}
                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-blue-300 mb-2">Processing Details</h4>
                      <div className="space-y-2 text-sm text-gray-300">
                        <div>• GL report will be generated and sent to property owner</div>
                        <div>• AppFolio sync will update all transaction statuses</div>
                        <div>• Reimbursement will auto-map to correct trust account</div>
                        <div>• All pending transactions will be marked as reconciled</div>
                        {ccRecipient.email && (
                          <div className="text-blue-400">• Additional copy will be sent to {ccRecipient.name} ({ccRecipient.email})</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <DialogFooter className="mt-6">
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={processMonthlyReimbursement}
                  >
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Process GL Report & Reimburse
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                    onClick={() => setMonthlyReimbursementDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Collateral Upload Demo Dialog */}
            <Dialog open={collateralUploadDialogOpen} onOpenChange={setCollateralUploadDialogOpen}>
              <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl max-h-[80vh] overflow-y-auto m-4">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-blue-400" />
                    Upload Collateral Documents
                  </DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Upload documents to the collateral hub for this property.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Demo Notice */}
                  <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm font-semibold text-yellow-300">Demo Mode</span>
                    </div>
                    <p className="text-sm text-yellow-200">
                      This is a demonstration of the file upload interface. No files will actually be uploaded in this demo.
                    </p>
                  </div>

                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Drop files here or click to browse</h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Supported formats: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX (Max 10MB per file)
                    </p>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <FileText className="h-4 w-4 mr-2" />
                      Select Files
                    </Button>
                  </div>

                  {/* Document Details Form */}
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-300">Custom Filename</Label>
                      <Input
                        className="bg-gray-800 border-gray-600 text-white"
                        placeholder="Enter custom filename (e.g., HVAC_Service_Agreement_2024)"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-300">Document Type</Label>
                      <Select>
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700 text-white">
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="invoice">Invoice</SelectItem>
                          <SelectItem value="receipt">Receipt</SelectItem>
                          <SelectItem value="insurance">Insurance Certificate</SelectItem>
                          <SelectItem value="warranty">Warranty</SelectItem>
                          <SelectItem value="permit">Permit</SelectItem>
                          <SelectItem value="inspection">Inspection Report</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-gray-300">Property</Label>
                      <Select>
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue placeholder="Select property" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700 text-white">
                          <SelectItem value="stanford-gsb">Stanford GSB</SelectItem>
                          <SelectItem value="sunnyvale-432">Sunnyvale 432</SelectItem>
                          <SelectItem value="menlo-park">Menlo Park Complex</SelectItem>
                          <SelectItem value="palo-alto">Palo Alto Office</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-gray-300">Description (Optional)</Label>
                      <Textarea
                        className="bg-gray-800 border-gray-600 text-white"
                        placeholder="Add a description for this document..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label className="text-gray-300">Tags (Optional)</Label>
                      <Input
                        className="bg-gray-800 border-gray-600 text-white"
                        placeholder="Enter tags separated by commas (e.g., HVAC, Annual, Service)"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-300">Amount (If applicable)</Label>
                      <Input
                        type="number"
                        className="bg-gray-800 border-gray-600 text-white"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-300">Expiry Date (If applicable)</Label>
                      <Input
                        type="date"
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                  </div>

                  {/* Upload Progress (Demo) */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">Demo File 1.pdf</span>
                      <span className="text-green-400">Ready to upload</span>
                    </div>

                  </div>
                </div>

                <DialogFooter className="mt-6">
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      // Demo success message
                      alert('Demo: Files would be uploaded successfully!');
                      setCollateralUploadDialogOpen(false);
                    }}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Files (Demo)
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                    onClick={() => setCollateralUploadDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Ask AI Modal Dialog */}
            <Dialog open={askAiModalOpen} onOpenChange={setAskAiModalOpen}>
              <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto m-4">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-purple-400" />
                    Ask AI - Collateral Document Assistant
                  </DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Ask questions about your documents, expenses, and property management data. AI will analyze your collateral hub and provide insights.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  {/* Chat Messages */}
                  <div className="bg-gray-800 rounded-lg p-4 min-h-[400px] max-h-[500px] overflow-y-auto">
                    {aiChatMessages.length === 0 ? (
                      <div className="text-center text-gray-400 py-8">
                        <Bot className="h-12 w-12 mx-auto mb-4 text-purple-400" />
                        <h3 className="text-lg font-semibold mb-2">Ask me anything about your documents</h3>
                        <p className="text-sm mb-4">I can help you find information, analyze spending, and provide insights from your collateral hub.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-left">
                          <div className="bg-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-600 transition-colors"
                               onClick={() => handleAskAi("How much did we spend on HVAC repairs this year?")}>
                            <div className="text-sm font-medium text-white">💰 Spending Analysis</div>
                            <div className="text-xs text-gray-400">How much did we spend on HVAC repairs this year?</div>
                          </div>
                          <div className="bg-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-600 transition-colors"
                               onClick={() => handleAskAi("Show me inspection reports that mention mold")}>
                            <div className="text-sm font-medium text-white">🔍 Document Search</div>
                            <div className="text-xs text-gray-400">Show me inspection reports that mention mold</div>
                          </div>
                          <div className="bg-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-600 transition-colors"
                               onClick={() => handleAskAi("What properties have the highest maintenance costs?")}>
                            <div className="text-sm font-medium text-white">📊 Property Insights</div>
                            <div className="text-xs text-gray-400">What properties have the highest maintenance costs?</div>
                          </div>
                          <div className="bg-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-600 transition-colors"
                               onClick={() => handleAskAi("Find receipts where we were overcharged")}>
                            <div className="text-sm font-medium text-white">⚠️ Cost Analysis</div>
                            <div className="text-xs text-gray-400">Find receipts where we were overcharged</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {aiChatMessages.map((message, index) => (
                          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-lg p-3 ${
                              message.role === 'user' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-700 text-gray-100'
                            }`}>
                              <div className="flex items-start gap-2">
                                {message.role === 'assistant' && <Bot className="h-4 w-4 text-purple-400 mt-1 flex-shrink-0" />}
                                <div className="flex-1">
                                  <div className="whitespace-pre-wrap">{message.content}</div>
                                  
                                  {/* Related Documents */}
                                  {message.documents && message.documents.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                      <div className="text-xs font-semibold text-gray-300">Related Documents:</div>
                                      <div className="grid grid-cols-1 gap-2">
                                        {message.documents.map((doc: any) => {
                                          const IconComponent = getDocumentTypeIcon(doc.documentType);
                                          return (
                                            <div key={doc.id} className="bg-gray-600 rounded-lg p-2 hover:bg-gray-500 transition-colors">
                                              <div className="flex items-center gap-2">
                                                <IconComponent className="h-3 w-3 text-blue-400" />
                                                <span className="text-xs font-medium text-white truncate">{doc.filename}</span>
                                              </div>
                                              <div className="text-xs text-gray-300 mt-1">
                                                {doc.propertyName} • {doc.uploadDate}
                                                {doc.amount && <span className="text-green-400 ml-2">${doc.amount.toLocaleString()}</span>}
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Chat Input */}
                  <div className="flex gap-2">
                    <Input
                      className="bg-gray-800 border-gray-600 text-white flex-1"
                      placeholder="Ask about your documents, expenses, or properties..."
                      value={aiChatInput}
                      onChange={(e) => setAiChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleAskAi(aiChatInput);
                        }
                      }}
                    />
                    <Button
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={() => handleAskAi(aiChatInput)}
                      disabled={!aiChatInput.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      onClick={() => handleAskAi("Show me a summary of all expenses this month")}
                    >
                      Monthly Summary
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      onClick={() => handleAskAi("What contracts are expiring soon?")}
                    >
                      Expiring Contracts
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      onClick={() => handleAskAi("Find all warranty documents")}
                    >
                      Warranty Docs
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      onClick={() => {
                        setAiChatMessages([]);
                        setAiChatInput('');
                      }}
                    >
                      Clear Chat
                    </Button>
                  </div>
                </div>

                <DialogFooter className="mt-6">
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                    onClick={() => setAskAiModalOpen(false)}
                  >
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Edit Policy Rule Dialog */}
            <Dialog open={policyRuleEditDialogOpen} onOpenChange={setPolicyRuleEditDialogOpen}>
              <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit Expense Policy Rule</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Modify the expense policy rule and AI settings.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Category</Label>
                    <Input
                      className="bg-gray-800 border-gray-600 text-white"
                      value={editedRule.category}
                      onChange={e => setEditedRule(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="Rule category"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Rule Description</Label>
                    <Textarea
                      className="bg-gray-800 border-gray-600 text-white"
                      value={editedRule.rule}
                      onChange={e => setEditedRule(prev => ({ ...prev, rule: e.target.value }))}
                      placeholder="Describe the expense policy rule..."
                      rows={4}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-300">AI Enabled</Label>
                      <div className="text-sm text-gray-400">Allow AI to automatically apply this rule</div>
                    </div>
                    <Switch
                      checked={editedRule.aiEnabled}
                      onCheckedChange={checked => setEditedRule(prev => ({ ...prev, aiEnabled: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-300">Active</Label>
                      <div className="text-sm text-gray-400">Rule is currently active and enforced</div>
                    </div>
                    <Switch
                      checked={editedRule.active}
                      onCheckedChange={checked => setEditedRule(prev => ({ ...prev, active: checked }))}
                    />
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleSavePolicyRule}
                    disabled={!editedRule.category || !editedRule.rule}
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                    onClick={() => setPolicyRuleEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Expense Policy Edit Dialog */}
            <Dialog open={expensePolicyDialogOpen} onOpenChange={setExpensePolicyDialogOpen}>
              <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Expense Policy Rules</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Manage expense policy rules and AI automation settings.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Current Policy Rules</h4>
                    <div className="space-y-3">
                      {policyRules.map(rule => (
                        <div key={rule.id} className="p-4 bg-gray-800 rounded-lg border border-gray-600">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-blue-300">{rule.category}</span>
                            <div className="flex items-center gap-2">
                              {rule.aiEnabled && (
                                <Badge className="bg-purple-600 text-white text-xs">AI</Badge>
                              )}
                              <Badge className={rule.active ? "bg-green-600 text-white text-xs" : "bg-gray-600 text-white text-xs"}>
                                {rule.active ? 'Active' : 'Inactive'}
                              </Badge>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-blue-400 hover:text-blue-300 p-1 h-auto"
                                onClick={() => handleEditPolicyRule(rule)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-300">{rule.rule}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                    onClick={() => setExpensePolicyDialogOpen(false)}
                  >
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  )
}
