"use client"

import React from "react"
import { DialogFooter } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  Edit
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from 'next/navigation'
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { jobsList, activityMilestones, jobNotes, activityFiles } from './mockData';

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

const transactionsList: Transaction[] = [
  {
    id: 'txn1',
    date: '2024-03-15',
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
    date: '2024-03-16',
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
    date: '2024-03-17',
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
    date: '2024-03-18',
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
    date: '2024-03-19',
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

// Add type for milestone ownership
type MilestoneOwner = 'PM' | 'Technician' | 'Central Office';

// Add new types for enhanced payments functionality
type WilburCCTransaction = {
  id: string
  date: string
  vendor: string
  amount: number
  cardHolder: string
  propertyId: string
  jobId?: string
  memo?: string
  receipt?: string
  status: 'pending' | 'reimbursed'
  reimbursementDate?: string
  reimbursementMemo?: string
}

type MonthlyReport = {
  id: string
  propertyId: string
  month: string
  year: string
  totalExpenses: number
  reimbursedAmount: number
  pendingAmount: number
  expenses: WilburCCTransaction[]
  reportDate: string
  backupLocation?: string
}

type TrustAccountBalance = {
  propertyId: string
  propertyName: string
  currentBalance: number
  lastUpdated: string
  pendingTransactions: number
  reconciliationStatus: 'balanced' | 'variance' | 'pending'
}

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
  // Update role state to include 'centralOffice'
  const [role, setRole] = useState<'pm' | 'technician' | 'centralOffice'>('pm');
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

  // Available activities for PM to add
  const availableActivities = [
    'Work Order Received',
    'Pre-Approval Sent', 
    'Pre-Approval Received',
    'Work Order Update',
    'Work Order Closed'
  ];

  // Handle URL parameters for tab navigation
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['dashboard', 'workorders', 'activity', 'wallet', 'transactions', 'properties', 'staff', 'payments'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

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
      ownerEmail: "owner@stanford.edu",
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
      ownerEmail: "owner@sunnyvale.com",
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
      ownerEmail: "owner@downtownlofts.com",
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

  // Mock data for Wilbur CC transactions
  const mockWilburCCTransactions: WilburCCTransaction[] = [
    {
      id: 'wcc1',
      date: '2024-01-15',
      vendor: 'Home Depot',
      amount: 150.00,
      cardHolder: 'John Smith',
      propertyId: 'stanford',
      jobId: 'job1',
      memo: 'HVAC parts for Stanford GSB',
      receipt: 'receipt_wcc1.pdf',
      status: 'pending'
    },
    {
      id: 'wcc2',
      date: '2024-01-16',
      vendor: 'Lowes',
      amount: 75.50,
      cardHolder: 'Sarah Johnson',
      propertyId: 'sunnyvale',
      jobId: 'job2',
      memo: 'Paint supplies for Sunnyvale 432',
      receipt: 'receipt_wcc2.pdf',
      status: 'pending'
    },
    {
      id: 'wcc3',
      date: '2024-01-17',
      vendor: 'Ace Hardware',
      amount: 45.25,
      cardHolder: 'Mike Chen',
      propertyId: 'downtown',
      jobId: 'job3',
      memo: 'Tools for Downtown Lofts',
      receipt: 'receipt_wcc3.pdf',
      status: 'reimbursed',
      reimbursementDate: '2024-01-18',
      reimbursementMemo: 'Reimbursed from Downtown Lofts trust account'
    },
    {
      id: 'wcc4',
      date: '2024-01-18',
      vendor: 'Home Depot',
      amount: 89.99,
      cardHolder: 'John Smith',
      propertyId: 'stanford',
      jobId: 'job1',
      memo: 'Additional HVAC components',
      receipt: 'receipt_wcc4.pdf',
      status: 'pending'
    },
    {
      id: 'wcc5',
      date: '2024-01-19',
      vendor: 'Sherwin Williams',
      amount: 125.75,
      cardHolder: 'Sarah Johnson',
      propertyId: 'sunnyvale',
      jobId: 'job2',
      memo: 'Premium paint for exterior',
      receipt: 'receipt_wcc5.pdf',
      status: 'pending'
    },
    {
      id: 'wcc6',
      date: '2024-01-20',
      vendor: 'Grainger',
      amount: 220.00,
      cardHolder: 'Mike Chen',
      propertyId: 'downtown',
      jobId: 'job3',
      memo: 'Electrical supplies for lighting upgrade',
      receipt: 'receipt_wcc6.pdf',
      status: 'reimbursed',
      reimbursementDate: '2024-01-21',
      reimbursementMemo: 'Reimbursed from Downtown Lofts trust account - electrical work'
    },
    {
      id: 'wcc7',
      date: '2024-01-21',
      vendor: 'Amazon',
      amount: 67.50,
      cardHolder: 'John Smith',
      propertyId: 'stanford',
      jobId: 'job4',
      memo: 'Smart thermostat for energy efficiency',
      receipt: 'receipt_wcc7.pdf',
      status: 'pending'
    }
  ];

  // Mock data for trust account balances
  const mockTrustAccountBalances: TrustAccountBalance[] = [
    {
      propertyId: 'stanford',
      propertyName: 'Stanford GSB',
      currentBalance: 15420.5,
      lastUpdated: '2024-01-20T10:00:00',
      pendingTransactions: 5,
      reconciliationStatus: 'balanced'
    },
    {
      propertyId: 'sunnyvale',
      propertyName: 'Sunnyvale 432',
      currentBalance: 28750.75,
      lastUpdated: '2024-01-20T09:30:00',
      pendingTransactions: 8,
      reconciliationStatus: 'balanced'
    },
    {
      propertyId: 'downtown',
      propertyName: 'Downtown Lofts',
      currentBalance: 12300.0,
      lastUpdated: '2024-01-20T08:45:00',
      pendingTransactions: 3,
      reconciliationStatus: 'variance'
    }
  ];

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
    { id: 't1', date: '2024-01-15', vendor: 'Home Depot', amount: 120.5, status: 'pending', jobId: 'job1', billable: true, madeBy: 'Alice Johnson', cardHolder: 'Alice Johnson', memo: undefined, receipt: undefined },
    { id: 't2', date: '2024-01-14', vendor: 'Lowe\'s', amount: 89.99, status: 'reconciled', jobId: 'job1', billable: false, madeBy: 'Alice Johnson', cardHolder: 'Alice Johnson', memo: undefined, receipt: undefined },
    { id: 't3', date: '2024-01-13', vendor: 'Ace Hardware', amount: 45.00, status: 'pending', jobId: 'job1', billable: true, madeBy: 'Alice Johnson', cardHolder: 'Alice Johnson', memo: undefined, receipt: undefined },
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

  // Sidebar tabs for each role
  const sidebarTabs =
    role === 'pm'
      ? [
          { id: 'dashboard', label: 'Dashboard', icon: Folder },
          { id: 'workorders', label: 'Work Orders', icon: FileText },
          { id: 'activity', label: 'Activity Log', icon: Zap },
          { id: 'wallet', label: 'Expenses', icon: CreditCard },
          { id: 'transactions', label: 'Transactions', icon: FileText },
          { id: 'properties', label: 'Properties', icon: Home },
          { id: 'staff', label: 'Technicians', icon: User },
        ]
      : role === 'centralOffice'
      ? [
          { id: 'dashboard', label: 'Dashboard', icon: Folder },
          { id: 'workorders', label: 'Work Orders', icon: FileText },
          { id: 'activity', label: 'Activity Log', icon: Zap },
          { id: 'payments', label: 'Payments', icon: DollarSign },
          { id: 'transactions', label: 'Transactions', icon: FileText },
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
  const totalSpend = txnsThisMonth.reduce((sum, txn) => sum + txn.amount, 0);
  const billableSpend = txnsThisMonth.filter(txn => txn.billable).reduce((sum, txn) => sum + txn.amount, 0);
  const nonBillableSpend = txnsThisMonth.filter(txn => !txn.billable).reduce((sum, txn) => sum + txn.amount, 0);
  const uncategorized = txnsThisMonth.filter(txn => !txn.jobId || txn.status === 'pending');
  const uncategorizedSpend = uncategorized.reduce((sum, txn) => sum + txn.amount, 0);

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

  id: string
  propertyId: string
  month: string
  year: string
  totalExpenses: number
  reimbursedAmount: number
  pendingAmount: number
  expenses: WilburCCTransaction[]
  reportDate: string
  backupLocation?: string
}

type TrustAccountBalance = {
  propertyId: string
  propertyName: string
  currentBalance: number
  lastUpdated: string
  pendingTransactions: number
  reconciliationStatus: 'balanced' | 'variance' | 'pending'
}

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
  // Update role state to include 'centralOffice'
  const [role, setRole] = useState<'pm' | 'technician' | 'centralOffice'>('pm');
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

  // Available activities for PM to add
  const availableActivities = [
    'Work Order Received',
    'Pre-Approval Sent', 
    'Pre-Approval Received',
    'Work Order Update',
    'Work Order Closed'
  ];

  // Handle URL parameters for tab navigation
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['dashboard', 'workorders', 'activity', 'wallet', 'transactions', 'properties', 'staff', 'payments'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

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
      ownerEmail: "owner@stanford.edu",
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
      ownerEmail: "owner@sunnyvale.com",
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
      ownerEmail: "owner@downtownlofts.com",
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

  // Mock data for Wilbur CC transactions
  const mockWilburCCTransactions: WilburCCTransaction[] = [
    {
      id: 'wcc1',
      date: '2024-01-15',
      vendor: 'Home Depot',
      amount: 150.00,
      cardHolder: 'John Smith',
      propertyId: 'stanford',
      jobId: 'job1',
      memo: 'HVAC parts for Stanford GSB',
      receipt: 'receipt_wcc1.pdf',
      status: 'pending'
    },
    {
      id: 'wcc2',
      date: '2024-01-16',
      vendor: 'Lowes',
      amount: 75.50,
      cardHolder: 'Sarah Johnson',
      propertyId: 'sunnyvale',
      jobId: 'job2',
      memo: 'Paint supplies for Sunnyvale 432',
      receipt: 'receipt_wcc2.pdf',
      status: 'pending'
    },
    {
      id: 'wcc3',
      date: '2024-01-17',
      vendor: 'Ace Hardware',
      amount: 45.25,
      cardHolder: 'Mike Chen',
      propertyId: 'downtown',
      jobId: 'job3',
      memo: 'Tools for Downtown Lofts',
      receipt: 'receipt_wcc3.pdf',
      status: 'reimbursed',
      reimbursementDate: '2024-01-18',
      reimbursementMemo: 'Reimbursed from Downtown Lofts trust account'
    },
    {
      id: 'wcc4',
      date: '2024-01-18',
      vendor: 'Home Depot',
      amount: 89.99,
      cardHolder: 'John Smith',
      propertyId: 'stanford',
      jobId: 'job1',
      memo: 'Additional HVAC components',
      receipt: 'receipt_wcc4.pdf',
      status: 'pending'
    },
    {
      id: 'wcc5',
      date: '2024-01-19',
      vendor: 'Sherwin Williams',
      amount: 125.75,
      cardHolder: 'Sarah Johnson',
      propertyId: 'sunnyvale',
      jobId: 'job2',
      memo: 'Premium paint for exterior',
      receipt: 'receipt_wcc5.pdf',
      status: 'pending'
    },
    {
      id: 'wcc6',
      date: '2024-01-20',
      vendor: 'Grainger',
      amount: 220.00,
      cardHolder: 'Mike Chen',
      propertyId: 'downtown',
      jobId: 'job3',
      memo: 'Electrical supplies for lighting upgrade',
      receipt: 'receipt_wcc6.pdf',
      status: 'reimbursed',
      reimbursementDate: '2024-01-21',
      reimbursementMemo: 'Reimbursed from Downtown Lofts trust account - electrical work'
    },
    {
      id: 'wcc7',
      date: '2024-01-21',
      vendor: 'Amazon',
      amount: 67.50,
      cardHolder: 'John Smith',
      propertyId: 'stanford',
      jobId: 'job4',
      memo: 'Smart thermostat for energy efficiency',
      receipt: 'receipt_wcc7.pdf',
      status: 'pending'
    }
  ];

  // Mock data for trust account balances
  const mockTrustAccountBalances: TrustAccountBalance[] = [
    {
      propertyId: 'stanford',
      propertyName: 'Stanford GSB',
      currentBalance: 15420.5,
      lastUpdated: '2024-01-20T10:00:00',
      pendingTransactions: 5,
      reconciliationStatus: 'balanced'
    },
    {
      propertyId: 'sunnyvale',
      propertyName: 'Sunnyvale 432',
      currentBalance: 28750.75,
      lastUpdated: '2024-01-20T09:30:00',
      pendingTransactions: 8,
      reconciliationStatus: 'balanced'
    },
    {
      propertyId: 'downtown',
      propertyName: 'Downtown Lofts',
      currentBalance: 12300.0,
      lastUpdated: '2024-01-20T08:45:00',
      pendingTransactions: 3,
      reconciliationStatus: 'variance'
    }
  ];

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
    { id: 't1', date: '2024-01-15', vendor: 'Home Depot', amount: 120.5, status: 'pending', jobId: 'job1', billable: true, madeBy: 'Alice Johnson', cardHolder: 'Alice Johnson', memo: undefined, receipt: undefined },
    { id: 't2', date: '2024-01-14', vendor: 'Lowe\'s', amount: 89.99, status: 'reconciled', jobId: 'job1', billable: false, madeBy: 'Alice Johnson', cardHolder: 'Alice Johnson', memo: undefined, receipt: undefined },
    { id: 't3', date: '2024-01-13', vendor: 'Ace Hardware', amount: 45.00, status: 'pending', jobId: 'job1', billable: true, madeBy: 'Alice Johnson', cardHolder: 'Alice Johnson', memo: undefined, receipt: undefined },
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

  // Sidebar tabs for each role
  const sidebarTabs =
    role === 'pm'
      ? [
          { id: 'dashboard', label: 'Dashboard', icon: Folder },
          { id: 'workorders', label: 'Work Orders', icon: FileText },
          { id: 'activity', label: 'Activity Log', icon: Zap },
          { id: 'wallet', label: 'Expenses', icon: CreditCard },
          { id: 'transactions', label: 'Transactions', icon: FileText },
          { id: 'properties', label: 'Properties', icon: Home },
          { id: 'staff', label: 'Technicians', icon: User },
        ]
      : role === 'centralOffice'
      ? [
          { id: 'dashboard', label: 'Dashboard', icon: Folder },
          { id: 'workorders', label: 'Work Orders', icon: FileText },
          { id: 'activity', label: 'Activity Log', icon: Zap },
          { id: 'payments', label: 'Payments', icon: DollarSign },
          { id: 'transactions', label: 'Transactions', icon: FileText },
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
  const totalSpend = txnsThisMonth.reduce((sum, txn) => sum + txn.amount, 0);
  const billableSpend = txnsThisMonth.filter(txn => txn.billable).reduce((sum, txn) => sum + txn.amount, 0);
  const nonBillableSpend = txnsThisMonth.filter(txn => !txn.billable).reduce((sum, txn) => sum + txn.amount, 0);
  const uncategorized = txnsThisMonth.filter(txn => !txn.jobId || txn.status === 'pending');
  const uncategorizedSpend = uncategorized.reduce((sum, txn) => sum + txn.amount, 0);

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
    } else if (role === 'centralOffice') {
      // For Central Office, show all work orders (they can see everything)
      return workOrders;
    }
    return workOrders;
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

  // Enhanced Payments State for Central Office
  const [wilburCCTransactions, setWilburCCTransactions] = useState<WilburCCTransaction[]>(mockWilburCCTransactions);
  const [monthlyReports, setMonthlyReports] = useState<MonthlyReport[]>([]);
  const [trustAccountBalances, setTrustAccountBalances] = useState<TrustAccountBalance[]>(mockTrustAccountBalances);
  const [reimbursementDialogOpen, setReimbursementDialogOpen] = useState(false);
  const [selectedWilburTransaction, setSelectedWilburTransaction] = useState<WilburCCTransaction | null>(null);
  const [reimbursementForm, setReimbursementForm] = useState({
    propertyId: '',
    amount: '',
    memo: '',
    backupLocation: ''
  });
  const [monthlyReportDialogOpen, setMonthlyReportDialogOpen] = useState(false);
  const [selectedPropertyForReport, setSelectedPropertyForReport] = useState<string>('');
  const [reportMonth, setReportMonth] = useState<string>('');
  const [reportYear, setReportYear] = useState<string>('');

"use client"

import React from "react"
import { DialogFooter } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  Edit
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from 'next/navigation'
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { jobsList, activityMilestones, jobNotes, activityFiles } from './mockData';

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

const transactionsList: Transaction[] = [
  {
    id: 'txn1',
    date: '2024-03-15',
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
    date: '2024-03-16',
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
    date: '2024-03-17',
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
    date: '2024-03-18',
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
    date: '2024-03-19',
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

// Add type for milestone ownership
type MilestoneOwner = 'PM' | 'Technician' | 'Central Office';

// Add new types for enhanced payments functionality
type WilburCCTransaction = {
  id: string
  date: string
  vendor: string
  amount: number
  cardHolder: string
  propertyId: string
  jobId?: string
  memo?: string
  receipt?: string
  status: 'pending' | 'reimbursed'
  reimbursementDate?: string
  reimbursementMemo?: string
}

type MonthlyReport = {
  id: string
  propertyId: string
  month: string
  year: string
  totalExpenses: number
  reimbursedAmount: number
  pendingAmount: number
  expenses: WilburCCTransaction[]
  reportDate: string
  backupLocation?: string
}

type TrustAccountBalance = {
  propertyId: string
  propertyName: string
  currentBalance: number
  lastUpdated: string
  pendingTransactions: number
  reconciliationStatus: 'balanced' | 'variance' | 'pending'
}

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
  // Update role state to include 'centralOffice'
  const [role, setRole] = useState<'pm' | 'technician' | 'centralOffice'>('pm');
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

  // Available activities for PM to add
  const availableActivities = [
    'Work Order Received',
    'Pre-Approval Sent', 
    'Pre-Approval Received',
    'Work Order Update',
    'Work Order Closed'
  ];

  // Handle URL parameters for tab navigation
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['dashboard', 'workorders', 'activity', 'wallet', 'transactions', 'properties', 'staff', 'payments'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

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
      ownerEmail: "owner@stanford.edu",
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
      ownerEmail: "owner@sunnyvale.com",
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
      ownerEmail: "owner@downtownlofts.com",
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

  // Mock data for Wilbur CC transactions
  const mockWilburCCTransactions: WilburCCTransaction[] = [
    {
      id: 'wcc1',
      date: '2024-01-15',
      vendor: 'Home Depot',
      amount: 150.00,
      cardHolder: 'John Smith',
      propertyId: 'stanford',
      jobId: 'job1',
      memo: 'HVAC parts for Stanford GSB',
      receipt: 'receipt_wcc1.pdf',
      status: 'pending'
    },
    {
      id: 'wcc2',
      date: '2024-01-16',
      vendor: 'Lowes',
      amount: 75.50,
      cardHolder: 'Sarah Johnson',
      propertyId: 'sunnyvale',
      jobId: 'job2',
      memo: 'Paint supplies for Sunnyvale 432',
      receipt: 'receipt_wcc2.pdf',
      status: 'pending'
    },
    {
      id: 'wcc3',
      date: '2024-01-17',
      vendor: 'Ace Hardware',
      amount: 45.25,
      cardHolder: 'Mike Chen',
      propertyId: 'downtown',
      jobId: 'job3',
      memo: 'Tools for Downtown Lofts',
      receipt: 'receipt_wcc3.pdf',
      status: 'reimbursed',
      reimbursementDate: '2024-01-18',
      reimbursementMemo: 'Reimbursed from Downtown Lofts trust account'
    },
    {
      id: 'wcc4',
      date: '2024-01-18',
      vendor: 'Home Depot',
      amount: 89.99,
      cardHolder: 'John Smith',
      propertyId: 'stanford',
      jobId: 'job1',
      memo: 'Additional HVAC components',
      receipt: 'receipt_wcc4.pdf',
      status: 'pending'
    },
    {
      id: 'wcc5',
      date: '2024-01-19',
      vendor: 'Sherwin Williams',
      amount: 125.75,
      cardHolder: 'Sarah Johnson',
      propertyId: 'sunnyvale',
      jobId: 'job2',
      memo: 'Premium paint for exterior',
      receipt: 'receipt_wcc5.pdf',
      status: 'pending'
    },
    {
      id: 'wcc6',
      date: '2024-01-20',
      vendor: 'Grainger',
      amount: 220.00,
      cardHolder: 'Mike Chen',
      propertyId: 'downtown',
      jobId: 'job3',
      memo: 'Electrical supplies for lighting upgrade',
      receipt: 'receipt_wcc6.pdf',
      status: 'reimbursed',
      reimbursementDate: '2024-01-21',
      reimbursementMemo: 'Reimbursed from Downtown Lofts trust account - electrical work'
    },
    {
      id: 'wcc7',
      date: '2024-01-21',
      vendor: 'Amazon',
      amount: 67.50,
      cardHolder: 'John Smith',
      propertyId: 'stanford',
      jobId: 'job4',
      memo: 'Smart thermostat for energy efficiency',
      receipt: 'receipt_wcc7.pdf',
      status: 'pending'
    }
  ];

  // Mock data for trust account balances
  const mockTrustAccountBalances: TrustAccountBalance[] = [
    {
      propertyId: 'stanford',
      propertyName: 'Stanford GSB',
      currentBalance: 15420.5,
      lastUpdated: '2024-01-20T10:00:00',
      pendingTransactions: 5,
      reconciliationStatus: 'balanced'
    },
    {
      propertyId: 'sunnyvale',
      propertyName: 'Sunnyvale 432',
      currentBalance: 28750.75,
      lastUpdated: '2024-01-20T09:30:00',
      pendingTransactions: 8,
      reconciliationStatus: 'balanced'
    },
    {
      propertyId: 'downtown',
      propertyName: 'Downtown Lofts',
      currentBalance: 12300.0,
      lastUpdated: '2024-01-20T08:45:00',
      pendingTransactions: 3,
      reconciliationStatus: 'variance'
    }
  ];

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
    { id: 't1', date: '2024-01-15', vendor: 'Home Depot', amount: 120.5, status: 'pending', jobId: 'job1', billable: true, madeBy: 'Alice Johnson', cardHolder: 'Alice Johnson', memo: undefined, receipt: undefined },
    { id: 't2', date: '2024-01-14', vendor: 'Lowe\'s', amount: 89.99, status: 'reconciled', jobId: 'job1', billable: false, madeBy: 'Alice Johnson', cardHolder: 'Alice Johnson', memo: undefined, receipt: undefined },
    { id: 't3', date: '2024-01-13', vendor: 'Ace Hardware', amount: 45.00, status: 'pending', jobId: 'job1', billable: true, madeBy: 'Alice Johnson', cardHolder: 'Alice Johnson', memo: undefined, receipt: undefined },
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

  // Sidebar tabs for each role
  const sidebarTabs =
    role === 'pm'
      ? [
          { id: 'dashboard', label: 'Dashboard', icon: Folder },
          { id: 'workorders', label: 'Work Orders', icon: FileText },
          { id: 'activity', label: 'Activity Log', icon: Zap },
          { id: 'wallet', label: 'Expenses', icon: CreditCard },
          { id: 'transactions', label: 'Transactions', icon: FileText },
          { id: 'properties', label: 'Properties', icon: Home },
          { id: 'staff', label: 'Technicians', icon: User },
        ]
      : role === 'centralOffice'
      ? [
          { id: 'dashboard', label: 'Dashboard', icon: Folder },
          { id: 'workorders', label: 'Work Orders', icon: FileText },
          { id: 'activity', label: 'Activity Log', icon: Zap },
          { id: 'payments', label: 'Payments', icon: DollarSign },
          { id: 'transactions', label: 'Transactions', icon: FileText },
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
  const totalSpend = txnsThisMonth.reduce((sum, txn) => sum + txn.amount, 0);
  const billableSpend = txnsThisMonth.filter(txn => txn.billable).reduce((sum, txn) => sum + txn.amount, 0);
  const nonBillableSpend = txnsThisMonth.filter(txn => !txn.billable).reduce((sum, txn) => sum + txn.amount, 0);
  const uncategorized = txnsThisMonth.filter(txn => !txn.jobId || txn.status === 'pending');
  const uncategorizedSpend = uncategorized.reduce((sum, txn) => sum + txn.amount, 0);

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

"use client"

import React from "react"
import { DialogFooter } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  Edit
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from 'next/navigation'
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { jobsList, activityMilestones, jobNotes, activityFiles } from './mockData';

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

const transactionsList: Transaction[] = [
  {
    id: 'txn1',
    date: '2024-03-15',
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
    date: '2024-03-16',
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
    date: '2024-03-17',
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
    date: '2024-03-18',
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
    date: '2024-03-19',
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

// Add type for milestone ownership
type MilestoneOwner = 'PM' | 'Technician' | 'Central Office';

// Add new types for enhanced payments functionality
type WilburCCTransaction = {
  id: string
  date: string
  vendor: string
  amount: number
  cardHolder: string
  propertyId: string
  jobId?: string
  memo?: string
  receipt?: string
  status: 'pending' | 'reimbursed'
  reimbursementDate?: string
  reimbursementMemo?: string
}

type MonthlyReport = {
  id: string
  propertyId: string
  month: string
  year: string
  totalExpenses: number
  reimbursedAmount: number
  pendingAmount: number
  expenses: WilburCCTransaction[]
  reportDate: string
  backupLocation?: string
}

type TrustAccountBalance = {
  propertyId: string
  propertyName: string
  currentBalance: number
  lastUpdated: string
  pendingTransactions: number
  reconciliationStatus: 'balanced' | 'variance' | 'pending'
}

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
  // Update role state to include 'centralOffice'
  const [role, setRole] = useState<'pm' | 'technician' | 'centralOffice'>('pm');
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

  // Available activities for PM to add
  const availableActivities = [
    'Work Order Received',
    'Pre-Approval Sent', 
    'Pre-Approval Received',
    'Work Order Update',
    'Work Order Closed'
  ];

  // Handle URL parameters for tab navigation
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['dashboard', 'workorders', 'activity', 'wallet', 'transactions', 'properties', 'staff', 'payments'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

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
      ownerEmail: "owner@stanford.edu",
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
      ownerEmail: "owner@sunnyvale.com",
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
      ownerEmail: "owner@downtownlofts.com",
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

  // Mock data for Wilbur CC transactions
  const mockWilburCCTransactions: WilburCCTransaction[] = [
    {
      id: 'wcc1',
      date: '2024-01-15',
      vendor: 'Home Depot',
      amount: 150.00,
      cardHolder: 'John Smith',
      propertyId: 'stanford',
      jobId: 'job1',
      memo: 'HVAC parts for Stanford GSB',
      receipt: 'receipt_wcc1.pdf',
      status: 'pending'
    },
    {
      id: 'wcc2',
      date: '2024-01-16',
      vendor: 'Lowes',
      amount: 75.50,
      cardHolder: 'Sarah Johnson',
      propertyId: 'sunnyvale',
      jobId: 'job2',
      memo: 'Paint supplies for Sunnyvale 432',
      receipt: 'receipt_wcc2.pdf',
      status: 'pending'
    },
    {
      id: 'wcc3',
      date: '2024-01-17',
      vendor: 'Ace Hardware',
      amount: 45.25,
      cardHolder: 'Mike Chen',
      propertyId: 'downtown',
      jobId: 'job3',
      memo: 'Tools for Downtown Lofts',
      receipt: 'receipt_wcc3.pdf',
      status: 'reimbursed',
      reimbursementDate: '2024-01-18',
      reimbursementMemo: 'Reimbursed from Downtown Lofts trust account'
    },
    {
      id: 'wcc4',
      date: '2024-01-18',
      vendor: 'Home Depot',
      amount: 89.99,
      cardHolder: 'John Smith',
      propertyId: 'stanford',
      jobId: 'job1',
      memo: 'Additional HVAC components',
      receipt: 'receipt_wcc4.pdf',
      status: 'pending'
    },
    {
      id: 'wcc5',
      date: '2024-01-19',
      vendor: 'Sherwin Williams',
      amount: 125.75,
      cardHolder: 'Sarah Johnson',
      propertyId: 'sunnyvale',
      jobId: 'job2',
      memo: 'Premium paint for exterior',
      receipt: 'receipt_wcc5.pdf',
      status: 'pending'
    },
    {
      id: 'wcc6',
      date: '2024-01-20',
      vendor: 'Grainger',
      amount: 220.00,
      cardHolder: 'Mike Chen',
      propertyId: 'downtown',
      jobId: 'job3',
      memo: 'Electrical supplies for lighting upgrade',
      receipt: 'receipt_wcc6.pdf',
      status: 'reimbursed',
      reimbursementDate: '2024-01-21',
      reimbursementMemo: 'Reimbursed from Downtown Lofts trust account - electrical work'
    },
    {
      id: 'wcc7',
      date: '2024-01-21',
      vendor: 'Amazon',
      amount: 67.50,
      cardHolder: 'John Smith',
      propertyId: 'stanford',
      jobId: 'job4',
      memo: 'Smart thermostat for energy efficiency',
      receipt: 'receipt_wcc7.pdf',
      status: 'pending'
    }
  ];

  // Mock data for trust account balances
  const mockTrustAccountBalances: TrustAccountBalance[] = [
    {
      propertyId: 'stanford',
      propertyName: 'Stanford GSB',
      currentBalance: 15420.5,
      lastUpdated: '2024-01-20T10:00:00',
      pendingTransactions: 5,
      reconciliationStatus: 'balanced'
    },
    {
      propertyId: 'sunnyvale',
      propertyName: 'Sunnyvale 432',
      currentBalance: 28750.75,
      lastUpdated: '2024-01-20T09:30:00',
      pendingTransactions: 8,
      reconciliationStatus: 'balanced'
    },
    {
      propertyId: 'downtown',
      propertyName: 'Downtown Lofts',
      currentBalance: 12300.0,
      lastUpdated: '2024-01-20T08:45:00',
      pendingTransactions: 3,
      reconciliationStatus: 'variance'
    }
  ];

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
    { id: 't1', date: '2024-01-15', vendor: 'Home Depot', amount: 120.5, status: 'pending', jobId: 'job1', billable: true, madeBy: 'Alice Johnson', cardHolder: 'Alice Johnson', memo: undefined, receipt: undefined },
    { id: 't2', date: '2024-01-14', vendor: 'Lowe\'s', amount: 89.99, status: 'reconciled', jobId: 'job1', billable: false, madeBy: 'Alice Johnson', cardHolder: 'Alice Johnson', memo: undefined, receipt: undefined },
    { id: 't3', date: '2024-01-13', vendor: 'Ace Hardware', amount: 45.00, status: 'pending', jobId: 'job1', billable: true, madeBy: 'Alice Johnson', cardHolder: 'Alice Johnson', memo: undefined, receipt: undefined },
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

  // Sidebar tabs for each role
  const sidebarTabs =
    role === 'pm'
      ? [
          { id: 'dashboard', label: 'Dashboard', icon: Folder },
          { id: 'workorders', label: 'Work Orders', icon: FileText },
          { id: 'activity', label: 'Activity Log', icon: Zap },
          { id: 'wallet', label: 'Expenses', icon: CreditCard },
          { id: 'transactions', label: 'Transactions', icon: FileText },
          { id: 'properties', label: 'Properties', icon: Home },
          { id: 'staff', label: 'Technicians', icon: User },
        ]
      : role === 'centralOffice'
      ? [
          { id: 'dashboard', label: 'Dashboard', icon: Folder },
          { id: 'workorders', label: 'Work Orders', icon: FileText },
          { id: 'activity', label: 'Activity Log', icon: Zap },
          { id: 'payments', label: 'Payments', icon: DollarSign },
          { id: 'transactions', label: 'Transactions', icon: FileText },
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
  const totalSpend = txnsThisMonth.reduce((sum, txn) => sum + txn.amount, 0);
  const billableSpend = txnsThisMonth.filter(txn => txn.billable).reduce((sum, txn) => sum + txn.amount, 0);
  const nonBillableSpend = txnsThisMonth.filter(txn => !txn.billable).reduce((sum, txn) => sum + txn.amount, 0);
  const uncategorized = txnsThisMonth.filter(txn => !txn.jobId || txn.status === 'pending');
  const uncategorizedSpend = uncategorized.reduce((sum, txn) => sum + txn.amount, 0);

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
    } else if (role === 'centralOffice') {
      // For Central Office, show all work orders (they can see everything)
      return workOrders;
    }
    return workOrders;
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

  // Enhanced Payments State for Central Office
  const [wilburCCTransactions, setWilburCCTransactions] = useState<WilburCCTransaction[]>(mockWilburCCTransactions);
  const [monthlyReports, setMonthlyReports] = useState<MonthlyReport[]>([]);
  const [trustAccountBalances, setTrustAccountBalances] = useState<TrustAccountBalance[]>(mockTrustAccountBalances);
  const [reimbursementDialogOpen, setReimbursementDialogOpen] = useState(false);
  const [selectedWilburTransaction, setSelectedWilburTransaction] = useState<WilburCCTransaction | null>(null);
  const [reimbursementForm, setReimbursementForm] = useState({
    propertyId: '',
    amount: '',
    memo: '',
    backupLocation: ''
  });
  const [monthlyReportDialogOpen, setMonthlyReportDialogOpen] = useState(false);
  const [selectedPropertyForReport, setSelectedPropertyForReport] = useState<string>('');
  const [reportMonth, setReportMonth] = useState<string>('');
  const [reportYear, setReportYear] = useState<string>('');

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Role Toggle for Demo */}
      <div className="flex justify-end p-4 bg-gray-900 border-b border-gray-800">
        <span className="mr-2 text-gray-400">Role:</span>
        <Button
          size="sm"
          className={role === 'pm' ? 'bg-blue-600 text-white mr-2' : 'border-blue-600 text-blue-400 mr-2'}
          variant={role === 'pm' ? 'default' : 'outline'}
          onClick={() => { setRole('pm'); setActiveTab('dashboard'); }}
        >
          Property Manager
        </Button>
        <Button
          size="sm"
          className={role === 'technician' ? 'bg-blue-600 text-white mr-2' : 'border-blue-600 text-blue-400 mr-2'}
          variant={role === 'technician' ? 'default' : 'outline'}
          onClick={() => { setRole('technician'); setActiveTab('dashboard'); }}
        >
          Technician
        </Button>
        <Button
          size="sm"
          className={role === 'centralOffice' ? 'bg-blue-600 text-white' : 'border-blue-600 text-blue-400'}
          variant={role === 'centralOffice' ? 'default' : 'outline'}
          onClick={() => { setRole('centralOffice'); setActiveTab('dashboard'); }}
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
                            ${allTxns.filter(txn => txn.status === 'reconciled' && isThisMonth(txn.date)).reduce((sum, txn) => sum + txn.amount, 0).toLocaleString(undefined, {minimumFractionDigits:2})}
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-4">
                          <div className="text-gray-400 text-xs mb-1">Awaiting Reimbursement</div>
                          <div className="text-3xl font-bold text-yellow-400">
                            ${allTxns.filter(txn => txn.status === 'pending' && txn.billable && isThisMonth(txn.date)).reduce((sum, txn) => sum + txn.amount, 0).toLocaleString(undefined, {minimumFractionDigits:2})}
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-4">
                          <div className="text-gray-400 text-xs mb-1">Issues / Needs Review</div>
                          <div className="text-3xl font-bold text-red-400">
                            ${allTxns.filter(txn => (!txn.jobId || txn.jobId === '') && isThisMonth(txn.date)).reduce((sum, txn) => sum + txn.amount, 0).toLocaleString(undefined, {minimumFractionDigits:2})}
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
                                              className="h-8 w-8 text-gray-300 hover:text-white hover:bg-blue-500/20"
                                              onClick={e => { e.stopPropagation(); setEditJob({ ...job }); setEditJobDialogOpen(true); }}
                                            >
                                              <Settings className="h-4 w-4" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>Edit job</TooltipContent>
                                        </Tooltip>
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
                                      <table className="min-w-full text-xs mb-2">
                                        <thead>
                                          <tr className="bg-gray-800 border-b border-gray-700">
                                            <th className="text-left py-2 px-3 font-semibold text-white">Date</th>
                                            <th className="text-left py-2 px-3 font-semibold text-white">Technician</th>
                                            <th className="text-left py-2 px-3 font-semibold text-white">Vendor</th>
                                            <th className="text-left py-2 px-3 font-semibold text-white">Amount</th>
                                            <th className="text-left py-2 px-3 font-semibold text-white">Status</th>
                                            <th className="text-left py-2 px-3 font-semibold text-white">Billable</th>
                                            <th className="text-left py-2 px-3 font-semibold text-white">Memo</th>
                                            <th className="text-left py-2 px-3 font-semibold text-white">Receipt</th>
                                            <th className="text-left py-2 px-3 font-semibold text-white">Actions</th>
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
                                                  <td className="py-2 px-3 text-gray-300">{txn.date}</td>
                                                  <td className="py-2 px-3 text-gray-300">{txn.madeBy}</td>
                                                  <td className="py-2 px-3 text-gray-300">{txn.vendor}</td>
                                                  <td className="py-2 px-3 text-gray-300">${txn.amount.toFixed(2)}</td>
                                                  <td className="py-2 px-3">
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
                                                  <td className="py-2 px-3">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${
                                                      txn.billable ? 'bg-green-700 text-green-100' : 'bg-gray-700 text-gray-200'
                                                    }`}>
                                                      {txn.billable ? 'Billable' : 'Non-Billable'}
                                                    </span>
                                                  </td>
                                                  <td className="py-2 px-3 text-gray-300">{txn.memo || '-'}</td>
                                                  <td className="py-2 px-3 text-gray-300">
                                                    {txn.receipt ? (
                                                      <FileText className="h-4 w-4 text-blue-400" />
                                                    ) : '-'}
                                                  </td>
                                                  <td className="py-2 px-3">
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
                  <h3 className="text-lg font-semibold text-white">Payments & Trust Accounts</h3>
                  {role === 'centralOffice' && (
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => setMonthlyReportDialogOpen(true)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
"use client"

import React from "react"
import { DialogFooter } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  Edit
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from 'next/navigation'
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { jobsList, activityMilestones, jobNotes, activityFiles } from './mockData';

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

const transactionsList: Transaction[] = [
  {
    id: 'txn1',
    date: '2024-03-15',
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
    date: '2024-03-16',
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
    date: '2024-03-17',
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
    date: '2024-03-18',
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
    date: '2024-03-19',
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

// Add type for milestone ownership
type MilestoneOwner = 'PM' | 'Technician' | 'Central Office';

// Add new types for enhanced payments functionality
type WilburCCTransaction = {
  id: string
  date: string
  vendor: string
  amount: number
  cardHolder: string
  propertyId: string
  jobId?: string
  memo?: string
  receipt?: string
  status: 'pending' | 'reimbursed'
  reimbursementDate?: string
  reimbursementMemo?: string
}

type MonthlyReport = {
  id: string
  propertyId: string
  month: string
  year: string
  totalExpenses: number
  reimbursedAmount: number
  pendingAmount: number
  expenses: WilburCCTransaction[]
  reportDate: string
  backupLocation?: string
}

type TrustAccountBalance = {
  propertyId: string
  propertyName: string
  currentBalance: number
  lastUpdated: string
  pendingTransactions: number
  reconciliationStatus: 'balanced' | 'variance' | 'pending'
}

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
  // Update role state to include 'centralOffice'
  const [role, setRole] = useState<'pm' | 'technician' | 'centralOffice'>('pm');
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

  // Available activities for PM to add
  const availableActivities = [
    'Work Order Received',
    'Pre-Approval Sent', 
    'Pre-Approval Received',
    'Work Order Update',
    'Work Order Closed'
  ];

  // Handle URL parameters for tab navigation
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['dashboard', 'workorders', 'activity', 'wallet', 'transactions', 'properties', 'staff', 'payments'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

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
      ownerEmail: "owner@stanford.edu",
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
      ownerEmail: "owner@sunnyvale.com",
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
      ownerEmail: "owner@downtownlofts.com",
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

  // Mock data for Wilbur CC transactions
  const mockWilburCCTransactions: WilburCCTransaction[] = [
    {
      id: 'wcc1',
      date: '2024-01-15',
      vendor: 'Home Depot',
      amount: 150.00,
      cardHolder: 'John Smith',
      propertyId: 'stanford',
      jobId: 'job1',
      memo: 'HVAC parts for Stanford GSB',
      receipt: 'receipt_wcc1.pdf',
      status: 'pending'
    },
    {
      id: 'wcc2',
      date: '2024-01-16',
      vendor: 'Lowes',
      amount: 75.50,
      cardHolder: 'Sarah Johnson',
      propertyId: 'sunnyvale',
      jobId: 'job2',
      memo: 'Paint supplies for Sunnyvale 432',
      receipt: 'receipt_wcc2.pdf',
      status: 'pending'
    },
    {
      id: 'wcc3',
      date: '2024-01-17',
      vendor: 'Ace Hardware',
      amount: 45.25,
      cardHolder: 'Mike Chen',
      propertyId: 'downtown',
      jobId: 'job3',
      memo: 'Tools for Downtown Lofts',
      receipt: 'receipt_wcc3.pdf',
      status: 'reimbursed',
      reimbursementDate: '2024-01-18',
      reimbursementMemo: 'Reimbursed from Downtown Lofts trust account'
    }
  ];

  // Mock data for trust account balances
  const mockTrustAccountBalances: TrustAccountBalance[] = [
    {
      propertyId: 'stanford',
      propertyName: 'Stanford GSB',
      currentBalance: 15420.5,
      lastUpdated: '2024-01-20T10:00:00',
      pendingTransactions: 5,
      reconciliationStatus: 'balanced'
    },
    {
      propertyId: 'sunnyvale',
      propertyName: 'Sunnyvale 432',
      currentBalance: 28750.75,
      lastUpdated: '2024-01-20T09:30:00',
      pendingTransactions: 8,
      reconciliationStatus: 'balanced'
    },
    {
      propertyId: 'downtown',
      propertyName: 'Downtown Lofts',
      currentBalance: 12300.0,
      lastUpdated: '2024-01-20T08:45:00',
      pendingTransactions: 3,
      reconciliationStatus: 'variance'
    }
  ];

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
    { id: 't1', date: '2024-01-15', vendor: 'Home Depot', amount: 120.5, status: 'pending', jobId: 'job1', billable: true, madeBy: 'Alice Johnson', cardHolder: 'Alice Johnson', memo: undefined, receipt: undefined },
    { id: 't2', date: '2024-01-14', vendor: 'Lowe\'s', amount: 89.99, status: 'reconciled', jobId: 'job1', billable: false, madeBy: 'Alice Johnson', cardHolder: 'Alice Johnson', memo: undefined, receipt: undefined },
    { id: 't3', date: '2024-01-13', vendor: 'Ace Hardware', amount: 45.00, status: 'pending', jobId: 'job1', billable: true, madeBy: 'Alice Johnson', cardHolder: 'Alice Johnson', memo: undefined, receipt: undefined },
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

  // Sidebar tabs for each role
  const sidebarTabs =
    role === 'pm'
      ? [
          { id: 'dashboard', label: 'Dashboard', icon: Folder },
          { id: 'workorders', label: 'Work Orders', icon: FileText },
          { id: 'activity', label: 'Activity Log', icon: Zap },
          { id: 'wallet', label: 'Expenses', icon: CreditCard },
          { id: 'transactions', label: 'Transactions', icon: FileText },
          { id: 'properties', label: 'Properties', icon: Home },
          { id: 'staff', label: 'Technicians', icon: User },
        ]
      : role === 'centralOffice'
      ? [
          { id: 'dashboard', label: 'Dashboard', icon: Folder },
          { id: 'workorders', label: 'Work Orders', icon: FileText },
          { id: 'activity', label: 'Activity Log', icon: Zap },
          { id: 'payments', label: 'Payments', icon: DollarSign },
          { id: 'transactions', label: 'Transactions', icon: FileText },
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
  const totalSpend = txnsThisMonth.reduce((sum, txn) => sum + txn.amount, 0);
  const billableSpend = txnsThisMonth.filter(txn => txn.billable).reduce((sum, txn) => sum + txn.amount, 0);
  const nonBillableSpend = txnsThisMonth.filter(txn => !txn.billable).reduce((sum, txn) => sum + txn.amount, 0);
  const uncategorized = txnsThisMonth.filter(txn => !txn.jobId || txn.status === 'pending');
  const uncategorizedSpend = uncategorized.reduce((sum, txn) => sum + txn.amount, 0);

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
    } else if (role === 'centralOffice') {
      // For Central Office, show all work orders (they can see everything)
      return workOrders;
    }
    return workOrders;
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

  // Enhanced Payments State for Central Office
  const [wilburCCTransactions, setWilburCCTransactions] = useState<WilburCCTransaction[]>(mockWilburCCTransactions);
  const [monthlyReports, setMonthlyReports] = useState<MonthlyReport[]>([]);
  const [trustAccountBalances, setTrustAccountBalances] = useState<TrustAccountBalance[]>(mockTrustAccountBalances);
  const [reimbursementDialogOpen, setReimbursementDialogOpen] = useState(false);
  const [selectedWilburTransaction, setSelectedWilburTransaction] = useState<WilburCCTransaction | null>(null);
  const [reimbursementForm, setReimbursementForm] = useState({
    propertyId: '',
    amount: '',
    memo: '',
    backupLocation: ''
  });
  const [monthlyReportDialogOpen, setMonthlyReportDialogOpen] = useState(false);
  const [selectedPropertyForReport, setSelectedPropertyForReport] = useState<string>('');
  const [reportMonth, setReportMonth] = useState<string>('');
  const [reportYear, setReportYear] = useState<string>('');

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Role Toggle for Demo */}
      <div className="flex justify-end p-4 bg-gray-900 border-b border-gray-800">
        <span className="mr-2 text-gray-400">Role:</span>
        <Button
          size="sm"
          className={role === 'pm' ? 'bg-blue-600 text-white mr-2' : 'border-blue-600 text-blue-400 mr-2'}
          variant={role === 'pm' ? 'default' : 'outline'}
          onClick={() => { setRole('pm'); setActiveTab('dashboard'); }}
        >
          Property Manager
        </Button>
        <Button
          size="sm"
          className={role === 'technician' ? 'bg-blue-600 text-white mr-2' : 'border-blue-600 text-blue-400 mr-2'}
          variant={role === 'technician' ? 'default' : 'outline'}
          onClick={() => { setRole('technician'); setActiveTab('dashboard'); }}
        >
          Technician
        </Button>
        <Button
          size="sm"
          className={role === 'centralOffice' ? 'bg-blue-600 text-white' : 'border-blue-600 text-blue-400'}
          variant={role === 'centralOffice' ? 'default' : 'outline'}
          onClick={() => { setRole('centralOffice'); setActiveTab('dashboard'); }}
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
                            ${allTxns.filter(txn => txn.status === 'reconciled' && isThisMonth(txn.date)).reduce((sum, txn) => sum + txn.amount, 0).toLocaleString(undefined, {minimumFractionDigits:2})}
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-4">
                          <div className="text-gray-400 text-xs mb-1">Awaiting Reimbursement</div>
                          <div className="text-3xl font-bold text-yellow-400">
                            ${allTxns.filter(txn => txn.status === 'pending' && txn.billable && isThisMonth(txn.date)).reduce((sum, txn) => sum + txn.amount, 0).toLocaleString(undefined, {minimumFractionDigits:2})}
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-4">
                          <div className="text-gray-400 text-xs mb-1">Issues / Needs Review</div>
                          <div className="text-3xl font-bold text-red-400">
                            ${allTxns.filter(txn => (!txn.jobId || txn.jobId === '') && isThisMonth(txn.date)).reduce((sum, txn) => sum + txn.amount, 0).toLocaleString(undefined, {minimumFractionDigits:2})}
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
                                              className="h-8 w-8 text-gray-300 hover:text-white hover:bg-blue-500/20"
                                              onClick={e => { e.stopPropagation(); setEditJob({ ...job }); setEditJobDialogOpen(true); }}
                                            >
                                              <Settings className="h-4 w-4" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>Edit job</TooltipContent>
                                        </Tooltip>
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
                                      <table className="min-w-full text-xs mb-2">
                                        <thead>
                                          <tr className="bg-gray-800 border-b border-gray-700">
                                            <th className="text-left py-2 px-3 font-semibold text-white">Date</th>
                                            <th className="text-left py-2 px-3 font-semibold text-white">Technician</th>
                                            <th className="text-left py-2 px-3 font-semibold text-white">Vendor</th>
                                            <th className="text-left py-2 px-3 font-semibold text-white">Amount</th>
                                            <th className="text-left py-2 px-3 font-semibold text-white">Status</th>
                                            <th className="text-left py-2 px-3 font-semibold text-white">Billable</th>
                                            <th className="text-left py-2 px-3 font-semibold text-white">Memo</th>
                                            <th className="text-left py-2 px-3 font-semibold text-white">Receipt</th>
                                            <th className="text-left py-2 px-3 font-semibold text-white">Actions</th>
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
                                                  <td className="py-2 px-3 text-gray-300">{txn.date}</td>
                                                  <td className="py-2 px-3 text-gray-300">{txn.madeBy}</td>
                                                  <td className="py-2 px-3 text-gray-300">{txn.vendor}</td>
                                                  <td className="py-2 px-3 text-gray-300">${txn.amount.toFixed(2)}</td>
                                                  <td className="py-2 px-3">
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
                                                  <td className="py-2 px-3">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${
                                                      txn.billable ? 'bg-green-700 text-green-100' : 'bg-gray-700 text-gray-200'
                                                    }`}>
                                                      {txn.billable ? 'Billable' : 'Non-Billable'}
                                                    </span>
                                                  </td>
                                                  <td className="py-2 px-3 text-gray-300">{txn.memo || '-'}</td>
                                                  <td className="py-2 px-3 text-gray-300">
                                                    {txn.receipt ? (
                                                      <FileText className="h-4 w-4 text-blue-400" />
                                                    ) : '-'}
                                                  </td>
                                                  <td className="py-2 px-3">
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
                  <h3 className="text-lg font-semibold text-white">Payments & Trust Accounts</h3>
                  {role === 'centralOffice' && (
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => setMonthlyReportDialogOpen(true)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Monthly Report
                      </Button>
                    </div>
                  )}
                </div>

                {/* Trust Account Balances Overview */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Trust Account Balances</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {trustAccountBalances.map((balance) => (
                      <Card key={balance.propertyId} className="bg-gray-800 border-gray-700">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-white text-lg">{balance.propertyName}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Current Balance:</span>
                              <span className="text-white font-semibold">${balance.currentBalance.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Pending Transactions:</span>
                              <span className="text-yellow-400">{balance.pendingTransactions}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Status:</span>
                              <span className={balance.reconciliationStatus === 'balanced' ? 'text-green-400' : 
                                               balance.reconciliationStatus === 'variance' ? 'text-red-400' : 'text-yellow-400'}>
                                {balance.reconciliationStatus.charAt(0).toUpperCase() + balance.reconciliationStatus.slice(1)}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              Last updated: {new Date(balance.lastUpdated).toLocaleString()}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Wilbur CC Transactions - Central Office Only */}
                {role === 'centralOffice' && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-semibold text-white">Wilbur CC Transactions</h4>
                      <div className="flex gap-4 text-sm">
                        <div className="bg-gray-800 px-3 py-1 rounded-md">
                          <span className="text-gray-400">Total Pending: </span>
                          <span className="text-yellow-400 font-semibold">
                            ${wilburCCTransactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
                          </span>
                        </div>
                        <div className="bg-gray-800 px-3 py-1 rounded-md">
                          <span className="text-gray-400">Total Reimbursed: </span>
                          <span className="text-green-400 font-semibold">
                            ${wilburCCTransactions.filter(t => t.status === 'reimbursed').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
                          </span>
                        </div>
                        <div className="bg-gray-800 px-3 py-1 rounded-md">
                          <span className="text-gray-400">Grand Total: </span>
                          <span className="text-white font-semibold">
                            ${wilburCCTransactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Group by Work Order */}
                    <div className="space-y-4">
                      {(() => {
                        // Group transactions by work order
                        const groupedByJob = wilburCCTransactions.reduce((groups, transaction) => {
                          const jobId = transaction.jobId || 'unassigned';
                          if (!groups[jobId]) {
                            groups[jobId] = [];
                          }
                          groups[jobId].push(transaction);
                          return groups;
                        }, {} as Record<string, WilburCCTransaction[]>);

                        return Object.entries(groupedByJob).map(([jobId, transactions]) => {
                          const job = jobs.find(j => j.id === jobId);
                          const jobTotal = transactions.reduce((sum, t) => sum + t.amount, 0);
                          const pendingTotal = transactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0);
                          const reimbursedTotal = transactions.filter(t => t.status === 'reimbursed').reduce((sum, t) => sum + t.amount, 0);
                          
                          return (
                            <div key={jobId} className="bg-gray-800 rounded-lg border border-gray-700">
                              {/* Work Order Header */}
                              <div className="bg-gray-900 px-4 py-3 rounded-t-lg border-b border-gray-700">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h5 className="text-white font-semibold">
                                      {job ? job.description : 'Unassigned Work Order'}
                                    </h5>
                                    <p className="text-gray-400 text-sm">
                                      {job ? `Property: ${job.property}` : 'No property assigned'}
                                    </p>
                                  </div>
                                  <div className="flex gap-4 text-sm">
                                    <div>
                                      <span className="text-gray-400">Job Total: </span>
                                      <span className="text-white font-semibold">${jobTotal.toFixed(2)}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-400">Pending: </span>
                                      <span className="text-yellow-400 font-semibold">${pendingTotal.toFixed(2)}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-400">Reimbursed: </span>
                                      <span className="text-green-400 font-semibold">${reimbursedTotal.toFixed(2)}</span>
                                    </div>
                                    {pendingTotal > 0 && (
                                      <Button
                                        size="sm"
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                        onClick={() => {
                                          // Bulk reimburse all pending transactions for this job
                                          const pendingTransactions = transactions.filter(t => t.status === 'pending');
                                          const totalAmount = pendingTransactions.reduce((sum, t) => sum + t.amount, 0);
                                          setReimbursementForm({
                                            propertyId: pendingTransactions[0]?.propertyId || '',
                                            amount: totalAmount.toString(),
                                            memo: `Bulk reimbursement for ${job ? job.description : 'Unassigned Work Order'} - ${pendingTransactions.length} transactions`,
                                            backupLocation: ''
                                          });
                                          setSelectedWilburTransaction(pendingTransactions[0]);
                                          setReimbursementDialogOpen(true);
                                        }}
                                      >
                                        Reimburse All ({transactions.filter(t => t.status === 'pending').length})
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              {/* Transactions Table */}
                              <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                  <thead>
                                    <tr className="bg-gray-800 border-b border-gray-700">
                                      <th className="text-left py-2 px-4 font-semibold text-white">Date</th>
                                      <th className="text-left py-2 px-4 font-semibold text-white">Vendor</th>
                                      <th className="text-left py-2 px-4 font-semibold text-white">Amount</th>
                                      <th className="text-left py-2 px-4 font-semibold text-white">Card Holder</th>
                                      <th className="text-left py-2 px-4 font-semibold text-white">Memo</th>
                                      <th className="text-left py-2 px-4 font-semibold text-white">Status</th>
                                      <th className="text-left py-2 px-4 font-semibold text-white">Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {transactions.map((transaction) => (
                                      <tr key={transaction.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                                        <td className="py-2 px-4 text-gray-300">{transaction.date}</td>
                                        <td className="py-2 px-4 text-gray-300">{transaction.vendor}</td>
                                        <td className="py-2 px-4 text-gray-300">${transaction.amount.toFixed(2)}</td>
                                        <td className="py-2 px-4 text-gray-300">{transaction.cardHolder}</td>
                                        <td className="py-2 px-4 text-gray-300 max-w-xs truncate" title={transaction.memo || '-'}>
                                          {transaction.memo || '-'}
                                        </td>
                                        <td className="py-2 px-4">
                                          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${
                                            transaction.status === 'reimbursed' ? 'bg-green-700 text-green-100' : 'bg-yellow-700 text-yellow-100'
                                          }`}>
                                            {transaction.status === 'reimbursed' ? 'Reimbursed' : 'Pending'}
                                          </span>
                                        </td>
                                        <td className="py-2 px-4">
                                          {transaction.status === 'pending' && (
                                            <Button
                                              size="sm"
                                              className="bg-blue-600 hover:bg-blue-700 text-white"
                                              onClick={() => {
                                                setSelectedWilburTransaction(transaction);
                                                setReimbursementForm({
                                                  propertyId: transaction.propertyId,
                                                  amount: transaction.amount.toString(),
                                                  memo: `Reimbursement for ${transaction.vendor} - ${transaction.memo || 'No memo'}`,
                                                  backupLocation: ''
                                                });
                                                setReimbursementDialogOpen(true);
                                              }}
                                            >
                                              Reimburse
                                            </Button>
                                          )}
                                          {transaction.status === 'reimbursed' && (
                                            <div className="text-xs text-gray-400">
                                              <div>{transaction.reimbursementDate}</div>
                                              <div className="max-w-xs truncate" title={transaction.reimbursementMemo}>
                                                {transaction.reimbursementMemo}
                                              </div>
                                            </div>
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                )}

                {/* Monthly Reports - Central Office Only */}
                {role === 'centralOffice' && monthlyReports.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-4">Monthly Reports</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {monthlyReports.map((report) => {
                        const property = properties.find(p => p.id === report.propertyId);
                        return (
                          <Card key={report.id} className="bg-gray-800 border-gray-700">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-white text-lg">{property?.name || 'Unknown Property'}</CardTitle>
                              <CardDescription className="text-gray-400">
                                {report.month} {report.year}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Total Expenses:</span>
                                  <span className="text-white">${report.totalExpenses.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Reimbursed:</span>
                                  <span className="text-green-400">${report.reimbursedAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Pending:</span>
                                  <span className="text-yellow-400">${report.pendingAmount.toFixed(2)}</span>
                                </div>
                                {report.backupLocation && (
                                  <div className="text-xs text-blue-400">
                                    Backup: {report.backupLocation}
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Legacy Property Payments Table - REMOVED */}

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
                  <h3 className="text-lg font-semibold text-white mb-4">Completed Expenses</h3>
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
                  <h3 className="text-lg font-semibold text-white mb-4">My Expenses - {technicianName}</h3>
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
            {activeTab === "properties" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-white">Properties</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-gray-900 border-b border-gray-700">
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
                              <div className="font-medium text-white">{property.name}</div>
                            </td>
                            <td className="py-3 px-4 text-gray-300">{property.address}</td>
                          </tr>
                          {expandedPropertyEmployees === property.id && (
                            <tr className="bg-gray-900">
                              <td colSpan={2} className="p-0">
                                <div className="p-4">
                                  <h5 className="text-sm font-semibold text-white mb-3">Staff at {property.name}</h5>
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
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">{technicianOpenJobs.length}</div>
                          <div className="text-sm text-gray-400">Open Work Orders</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400">{technicianFinishedJobs.length}</div>
                          <div className="text-sm text-gray-400">Completed</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-400">${technicianTotalSpend.toFixed(2)}</div>
                          <div className="text-sm text-gray-400">This Month</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-400">{technicianOverdueJobs.length}</div>
                          <div className="text-sm text-gray-400">Overdue</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Pay Bills for {selectedProperty?.name}</DialogTitle>
            <DialogDescription>
              Process outstanding bills and update trust account balance.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Outstanding Amount</Label>
                <div className="text-2xl font-bold text-white">${selectedProperty?.pendingBills * 1000}</div>
              </div>
              <div>
                <Label className="text-gray-300">Trust Balance</Label>
                <div className="text-2xl font-bold text-green-400">${selectedProperty?.trustBalance.toLocaleString()}</div>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Payment Method</Label>
              <Select>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700 text-white">
                  <SelectItem value="trust">Trust Account</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                  <SelectItem value="ach">ACH Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Process Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report Dialog */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Generate Report for {selectedProperty?.name}</DialogTitle>
            <DialogDescription>
              Create a comprehensive financial report for the property.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Report Type</Label>
              <Select>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700 text-white">
                  <SelectItem value="monthly">Monthly Statement</SelectItem>
                  <SelectItem value="quarterly">Quarterly Report</SelectItem>
                  <SelectItem value="annual">Annual Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Date Range</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input type="date" className="bg-gray-800 border-gray-600 text-white" />
                <Input type="date" className="bg-gray-800 border-gray-600 text-white" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReportDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Generate Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approval Dialog */}
      <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Approval Details</DialogTitle>
            <DialogDescription>
              Review and manage approval request details.
            </DialogDescription>
          </DialogHeader>
          {selectedApproval && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Property</Label>
                  <div className="text-white font-semibold">{selectedApproval.propertyName}</div>
                </div>
                <div>
                  <Label className="text-gray-300">Type</Label>
                  <div className="text-white font-semibold capitalize">{selectedApproval.type}</div>
                </div>
                <div>
                  <Label className="text-gray-300">Amount</Label>
                  <div className="text-white font-semibold">${selectedApproval.amount?.toLocaleString()}</div>
                </div>
                <div>
                  <Label className="text-gray-300">Status</Label>
                  <Badge className={getStatusBadgeClass(selectedApproval.status)}>
                    {selectedApproval.status}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-gray-300">Description</Label>
                <div className="text-white">{selectedApproval.description}</div>
              </div>
              <div>
                <Label className="text-gray-300">Vendor</Label>
                <div className="text-white">{selectedApproval.vendor}</div>
              </div>
              <div>
                <Label className="text-gray-300">Priority</Label>
                <Badge className={selectedApproval.priority === 'high' ? 'bg-red-600' : 'bg-yellow-600'}>
                  {selectedApproval.priority}
                </Badge>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setApprovalDialogOpen(false)}>
              Close
            </Button>
            {selectedApproval?.status === 'pending' && (
              <>
                <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-600/20">
                  Reject
                </Button>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Job Dialog */}
      <Dialog open={newJobDialogOpen} onOpenChange={setNewJobDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Create New Work Order</DialogTitle>
            <DialogDescription>
              Add a new work order to the system.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Property</Label>
              <Select value={newWorkOrder.property} onValueChange={(value) => setNewWorkOrder(prev => ({ ...prev, property: value }))}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700 text-white">
                  {properties.map(property => (
                    <SelectItem key={property.id} value={property.name}>{property.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.property && <p className="text-red-400 text-sm">{formErrors.property}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Description</Label>
              <Input 
                className="bg-gray-800 border-gray-600 text-white"
                value={newWorkOrder.description}
                onChange={(e) => setNewWorkOrder(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter work order description"
              />
              {formErrors.description && <p className="text-red-400 text-sm">{formErrors.description}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Priority</Label>
              <Select value={newWorkOrder.priority} onValueChange={(value) => setNewWorkOrder(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700 text-white">
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Estimated Cost</Label>
              <Input 
                className="bg-gray-800 border-gray-600 text-white"
                type="number"
                value={newWorkOrder.cost}
                onChange={(e) => setNewWorkOrder(prev => ({ ...prev, cost: e.target.value }))}
                placeholder="Enter estimated cost"
              />
              {formErrors.cost && <p className="text-red-400 text-sm">{formErrors.cost}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Notes</Label>
              <Input 
                className="bg-gray-800 border-gray-600 text-white"
                value={newWorkOrder.notes}
                onChange={(e) => setNewWorkOrder(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewJobDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleCreateWorkOrder}>
              Create Work Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reimbursement Dialog - Central Office */}
      <Dialog open={reimbursementDialogOpen} onOpenChange={setReimbursementDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Reimburse Wilbur CC Expense</DialogTitle>
            <DialogDescription>
              Process reimbursement from appropriate trust account.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedWilburTransaction && (
              <div className="p-4 bg-gray-800 rounded-lg">
                <h4 className="font-semibold text-white mb-2">Transaction Details</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-gray-400">Vendor:</span> {selectedWilburTransaction.vendor}</div>
                  <div><span className="text-gray-400">Amount:</span> ${selectedWilburTransaction.amount}</div>
                  <div><span className="text-gray-400">Date:</span> {selectedWilburTransaction.date}</div>
                  <div><span className="text-gray-400">Card Holder:</span> {selectedWilburTransaction.cardHolder}</div>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-gray-300">Property Trust Account</Label>
              <Select value={reimbursementForm.propertyId} onValueChange={(value) => setReimbursementForm(prev => ({ ...prev, propertyId: value }))}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Select property trust account" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700 text-white">
                  {trustAccountBalances.map(balance => (
                    <SelectItem key={balance.propertyId} value={balance.propertyId}>
                      {balance.propertyName} - ${balance.currentBalance.toLocaleString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Reimbursement Amount</Label>
              <Input 
                className="bg-gray-800 border-gray-600 text-white"
                type="number"
                value={reimbursementForm.amount}
                onChange={(e) => setReimbursementForm(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="Enter reimbursement amount"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Memo</Label>
              <Input 
                className="bg-gray-800 border-gray-600 text-white"
                value={reimbursementForm.memo}
                onChange={(e) => setReimbursementForm(prev => ({ ...prev, memo: e.target.value }))}
                placeholder="Reimbursement memo"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Backup Location</Label>
              <Input 
                className="bg-gray-800 border-gray-600 text-white"
                value={reimbursementForm.backupLocation}
                onChange={(e) => setReimbursementForm(prev => ({ ...prev, backupLocation: e.target.value }))}
                placeholder="Where backup information is stored"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReimbursementDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => {
                // Process reimbursement
                if (selectedWilburTransaction) {
                  const updatedTransaction = {
                    ...selectedWilburTransaction,
                    status: 'reimbursed' as const,
                    reimbursementDate: new Date().toISOString().split('T')[0],
                    reimbursementMemo: reimbursementForm.memo
                  };
                  setWilburCCTransactions(prev => 
                    prev.map(t => t.id === selectedWilburTransaction.id ? updatedTransaction : t)
                  );
                  
                  // Create monthly report entry
                  const newReport: MonthlyReport = {
                    id: `report-${Date.now()}`,
                    propertyId: reimbursementForm.propertyId,
                    month: new Date().toLocaleDateString('en-US', { month: 'long' }),
                    year: new Date().getFullYear().toString(),
                    totalExpenses: selectedWilburTransaction.amount,
                    reimbursedAmount: selectedWilburTransaction.amount,
                    pendingAmount: 0,
                    expenses: [selectedWilburTransaction],
                    reportDate: new Date().toISOString(),
                    backupLocation: reimbursementForm.backupLocation
                  };
                  setMonthlyReports(prev => [...prev, newReport]);
                }
                setReimbursementDialogOpen(false);
                setSelectedWilburTransaction(null);
                setReimbursementForm({
                  propertyId: '',
                  amount: '',
                  memo: '',
                  backupLocation: ''
                });
              }}
            >
              Process Reimbursement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Monthly Report Dialog - Central Office */}
      <Dialog open={monthlyReportDialogOpen} onOpenChange={setMonthlyReportDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Generate Monthly Report</DialogTitle>
            <DialogDescription>
              Create a comprehensive monthly expense report for a property.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Property</Label>
              <Select value={selectedPropertyForReport} onValueChange={setSelectedPropertyForReport}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700 text-white">
                  {properties.map(property => (
                    <SelectItem key={property.id} value={property.id}>{property.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Month</Label>
                <Select value={reportMonth} onValueChange={setReportMonth}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700 text-white">
                    {Array.from({length: 12}, (_, i) => {
                      const date = new Date(2024, i, 1);
                      return date.toLocaleDateString('en-US', { month: 'long' });
                    }).map(month => (
                      <SelectItem key={month} value={month}>{month}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Year</Label>
                <Select value={reportYear} onValueChange={setReportYear}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700 text-white">
                    {[2023, 2024, 2025].map(year => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMonthlyReportDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                if (selectedPropertyForReport && reportMonth && reportYear) {
                  // Generate monthly report
                  const propertyExpenses = wilburCCTransactions.filter(t => 
                    t.propertyId === selectedPropertyForReport && 
                    new Date(t.date).getMonth() === new Date(`${reportMonth} 1, ${reportYear}`).getMonth() &&
                    new Date(t.date).getFullYear() === parseInt(reportYear)
                  );
                  
                  const totalExpenses = propertyExpenses.reduce((sum, t) => sum + t.amount, 0);
                  const reimbursedAmount = propertyExpenses.filter(t => t.status === 'reimbursed').reduce((sum, t) => sum + t.amount, 0);
                  const pendingAmount = propertyExpenses.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0);
                  
                  const newReport: MonthlyReport = {
                    id: `report-${Date.now()}`,
                    propertyId: selectedPropertyForReport,
                    month: reportMonth,
                    year: reportYear,
                    totalExpenses,
                    reimbursedAmount,
                    pendingAmount,
                    expenses: propertyExpenses,
                    reportDate: new Date().toISOString(),
                    backupLocation: `Monthly reports stored in /reports/${selectedPropertyForReport}/${reportYear}/${reportMonth}`
                  };
                  
                  setMonthlyReports(prev => [...prev, newReport]);
                  setMonthlyReportDialogOpen(false);
                  setSelectedPropertyForReport('');
                  setReportMonth('');
                  setReportYear('');
                }
              }}
            >
              Generate Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transaction Details Dialog */}
      <Dialog open={transactionDetailsOpen} onOpenChange={setTransactionDetailsOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              View detailed information about this transaction.
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Date</Label>
                  <div className="text-white">{selectedTransaction.date}</div>
                </div>
                <div>
                  <Label className="text-gray-300">Vendor</Label>
                  <div className="text-white">{selectedTransaction.vendor}</div>
                </div>
                <div>
                  <Label className="text-gray-300">Amount</Label>
                  <div className="text-white font-semibold">${selectedTransaction.amount.toFixed(2)}</div>
                </div>
                <div>
                  <Label className="text-gray-300">Made By</Label>
                  <div className="text-white">{selectedTransaction.madeBy}</div>
                </div>
                <div>
                  <Label className="text-gray-300">Status</Label>
                  <Badge className={selectedTransaction.status === 'reconciled' ? 'bg-green-600' : 'bg-yellow-600'}>
                    {selectedTransaction.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-gray-300">Billable</Label>
                  <Badge className={selectedTransaction.billable ? 'bg-green-600' : 'bg-gray-600'}>
                    {selectedTransaction.billable ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </div>
              {selectedTransaction.memo && (
                <div>
                  <Label className="text-gray-300">Memo</Label>
                  <div className="text-white">{selectedTransaction.memo}</div>
                </div>
              )}
              {selectedTransaction.receipt && (
                <div>
                  <Label className="text-gray-300">Receipt</Label>
                  <div className="text-blue-400 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {selectedTransaction.receipt}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setTransactionDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Smart Assist Drawer */}
      <Sheet open={smartAssistOpen} onOpenChange={setSmartAssistOpen}>
        <SheetContent className="bg-gray-900 border-gray-700 text-white w-96">
          <SheetHeader>
            <SheetTitle className="text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Smart Assist
            </SheetTitle>
            <SheetDescription className="text-gray-400">
              AI-powered assistance for your property management tasks.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-4 p-4">
              {smartAssistChat.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-800 text-gray-200'
                  }`}>
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-700">
              <div className="flex gap-2">
                <Input
                  className="flex-1 bg-gray-800 border-gray-600 text-white"
                  placeholder="Ask Smart Assist..."
                  value={smartAssistInput}
                  onChange={(e) => setSmartAssistInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSmartAssistSend()}
                />
                <Button 
                  size="icon" 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleSmartAssistSend}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}