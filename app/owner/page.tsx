"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { 
  DollarSign, 
  FileText, 
  Home, 
  TrendingUp, 
  BarChart3, 
  Brain, 
  Receipt, 
  FileArchive,
  Settings,
  Database,
  Search,
  Filter,
  Download,
  Upload,
  Calendar,
  User,
  Building,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  Eye,
  MoreVertical,
  Plus,
  Minus,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  CreditCard,
  Activity,
  TrendingDown,
  Flag,
  Bot,
  Sparkles,
  FileWarning,
  Award,
  MessageSquare,
  LinkIcon,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Mail,
  Phone,
  Check,
  X,
  Info,
  Send,
  Paperclip,
  Trash2,
  Copy,
  RefreshCw,
  Target,
  Zap,
  Calculator,
  FileSpreadsheet,
  Folder,
  DownloadCloud,
  Grid,
  List
} from "lucide-react"
import { cn } from "@/lib/utils"
import { 
  collateralDocuments, 
  documentTypeLabels, 
  propertyOptions, 
  staffOptions, 
  DocumentType, 
  CollateralDocument,
  jobsList,
  activityMilestones,
  jobNotes,
  activityFiles
} from "../mockData"
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts'

const OWNER_PASSWORD = "owner123"
const PM_PASSWORD = "pm123"

// Owner Dashboard Main Component
export default function OwnerDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")
  const [showPasswordDialog, setShowPasswordDialog] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [passwordError, setPasswordError] = useState("")
  
  // PM Dashboard access states
  const [showPMPasswordDialog, setShowPMPasswordDialog] = useState(false)
  const [pmPasswordInput, setPmPasswordInput] = useState("")
  const [pmPasswordError, setPmPasswordError] = useState("")

  // Check authentication on mount
  useEffect(() => {
    const ownerAuth = localStorage.getItem('ownerAuthenticated')
    if (ownerAuth === 'true') {
      setIsAuthenticated(true)
      setShowPasswordDialog(false)
    }
  }, [])

  const handlePasswordSubmit = () => {
    if (passwordInput === OWNER_PASSWORD) {
      setIsAuthenticated(true)
      setShowPasswordDialog(false)
      localStorage.setItem('ownerAuthenticated', 'true')
      setPasswordError("")
    } else {
      setPasswordError("Incorrect password")
    }
  }

  const handleBackToPM = () => {
    setShowPMPasswordDialog(true)
    setPmPasswordInput("")
    setPmPasswordError("")
  }

  const handlePMPasswordSubmit = () => {
    if (pmPasswordInput === PM_PASSWORD) {
      localStorage.removeItem('ownerAuthenticated')
      setShowPMPasswordDialog(false)
      router.push('/')
      setPmPasswordError("")
    } else {
      setPmPasswordError("Incorrect password")
    }
  }

  // Sidebar navigation tabs
  const ownerSidebarTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Folder },
    { id: 'expenses', label: 'Expenses', icon: DollarSign },
    { id: 'properties', label: 'Properties', icon: Home },
    { id: 'forecasting', label: 'Forecasting', icon: TrendingUp },
    { id: 'smart-insights', label: 'Smart Insights', icon: Brain },
    { id: 'reimbursements', label: 'Reimbursements', icon: Receipt },
    { id: 'reporting', label: 'Reporting', icon: FileText },
    { id: 'collateral', label: 'Collateral Hub', icon: FileArchive },
  ]

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Dialog open={showPasswordDialog} onOpenChange={() => {}}>
          <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Owner Portal Access</DialogTitle>
              <DialogDescription className="text-gray-400">
                Enter the owner password to access the dashboard
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">Password</Label>
                <Input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Enter owner password"
                />
                {passwordError && (
                  <p className="text-red-400 text-sm mt-1">{passwordError}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handlePasswordSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Access Dashboard
              </Button>
              <Button 
                variant="outline" 
                onClick={handleBackToPM}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                PM Dashboard
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <div className="w-64 bg-gray-900 border-r border-gray-800 p-4">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">JobVault</h1>
            <p className="text-sm text-gray-400">Owner Portal</p>
          </div>
          
          <nav className="space-y-1">
            {ownerSidebarTabs.map((item) => (
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
              <Button 
                variant="outline" 
                className="w-full justify-start bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <Database className="h-4 w-4 mr-2" />
                Sync All
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button 
                variant="outline" 
                onClick={handleBackToPM}
                className="w-full justify-start bg-red-900 border-red-700 text-red-300 hover:bg-red-800 hover:text-white"
              >
                <ArrowUp className="h-4 w-4 mr-2" />
                PM Dashboard
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white">Owner Dashboard</h1>
                  <p className="text-sm text-gray-400">Last updated: 7/8/2025</p>
                </div>
              </div>
            </div>
          </header>

          <div className="p-6">
            {/* Tab Content */}
            {activeTab === "dashboard" && <DashboardTab />}
            {activeTab === "expenses" && <ExpensesTab />}
            {activeTab === "properties" && <PropertiesTab />}
            {activeTab === "forecasting" && <ForecastingTab />}
            {activeTab === "smart-insights" && <SmartInsightsTab />}
            {activeTab === "reimbursements" && <ReimbursementsTab />}
            {activeTab === "reporting" && <ReportingTab />}
            {activeTab === "collateral" && <CollateralTab />}
          </div>
        </div>
      </div>

      {/* PM Dashboard Password Dialog */}
      <Dialog open={showPMPasswordDialog} onOpenChange={() => {}}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">PM Dashboard Access</DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter the PM password to access the dashboard
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Password</Label>
              <Input
                type="password"
                value={pmPasswordInput}
                onChange={(e) => setPmPasswordInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePMPasswordSubmit()}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="Enter PM password"
              />
              {pmPasswordError && (
                <p className="text-red-400 text-sm mt-1">{pmPasswordError}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={handlePMPasswordSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Access PM Dashboard
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowPMPasswordDialog(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Dashboard Tab Component
function DashboardTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* YTD Budget Pace */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-400">YTD Budget Pace</h3>
              <Info className="h-4 w-4 text-gray-500" />
            </div>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <span className="text-sm text-white">On pace to</span>
            </div>
            <div className="mt-1">
              <span className="text-lg font-bold text-white">overspend</span>
              <span className="text-sm text-red-400 ml-1">by $729K</span>
            </div>
            <div className="mt-2 text-xs text-gray-400">
              <div>Pacing: 134%</div>
              <div>51% of year complete</div>
              <div>(July 8th)</div>
              <div>$14.7M of $21.3M budget</div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Budget Pace */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-400">Monthly Budget Pace</h3>
              <Info className="h-4 w-4 text-gray-500" />
            </div>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <span className="text-sm text-white">Behind</span>
            </div>
            <div className="mt-1">
              <span className="text-lg font-bold text-white">pace</span>
              <span className="text-sm text-red-400 ml-1">by 276%</span>
            </div>
            <div className="mt-2 text-xs text-gray-400">
              <div>Pacing: 378%</div>
              <div>19% of month complete</div>
              <div>(July 8th)</div>
              <div>$1.3M of $1.8M July budget</div>
            </div>
          </CardContent>
        </Card>

        {/* Cost Savings Opportunities */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-400">Cost Savings Opportunities</h3>
              <DollarSign className="h-4 w-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-400">$425K</div>
            <div className="text-xs text-gray-400 mt-1">
              <div>Identified savings potential</div>
            </div>
          </CardContent>
        </Card>

        {/* Trust Balance */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-400">Trust Balance</h3>
              <DollarSign className="h-4 w-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-400">$235K</div>
            <div className="text-xs text-gray-400 mt-1">
              <div>Across 3 accounts</div>
            </div>
          </CardContent>
        </Card>

        {/* Cashback Earned */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-400">Cashback Earned</h3>
              <DollarSign className="h-4 w-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-400">$24K</div>
            <div className="text-xs text-gray-400 mt-1">
              <div>YTD from credit cards</div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-400">Pending Approvals</h3>
              <AlertCircle className="h-4 w-4 text-red-400" />
            </div>
            <div className="text-2xl font-bold text-red-400">3</div>
            <div className="text-xs text-gray-400 mt-1">
              <div>$15,550 total</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Action Items */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Action Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ActionItem
              title="Emergency HVAC repair - classroom 245"
              property="Stanford Graduate School of Business"
              amount="$2,500"
              status="urgent"
              button="Review"
            />
            <ActionItem
              title="Elevator modernization - safety compliance"
              property="Mission Bay Tech Campus"
              amount="$45,000"
              status="urgent"
              button="Review"
            />
            <ActionItem
              title="LED lighting upgrade - Building A"
              property="Redwood Shores Office Complex"
              amount="$12,000"
              status="low"
              button="Review"
            />
            <ActionItem
              title="Security system upgrade"
              property="Palo Alto Research Center"
              amount="$8,900"
              status="medium"
              button="Review"
            />
            <ActionItem
              title="Weekend emergency lockout service"
              property="South Bay Industrial Park"
              amount="$2,800"
              status="urgent"
              button="Review"
            />
            <ActionItem
              title="Major HVAC component replacement"
              property="Santa Clara Hub"
              amount="$5,200"
              status="urgent"
              button="Review"
            />
          </CardContent>
        </Card>

        {/* Portfolio Expense Status */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              Portfolio Expense Status
              <Info className="h-4 w-4 text-gray-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <PropertyExpenseStatus
              name="Stanford Graduate School of Business"
              ytd="$132k"
              budget="$4.3M"
              avg="41%"
              spent="$2.9M"
              behindPace="32%"
            />
            <PropertyExpenseStatus
              name="Mission Bay Tech Campus"
              ytd="$116k"
              budget="$5.4M"
              avg="39%"
              spent="$3.6M"
              behindPace="31%"
            />
            <PropertyExpenseStatus
              name="Redwood Shores Office Complex"
              ytd="$128k"
              budget="$3.8M"
              avg="44%"
              spent="$2.7M"
              behindPace="36%"
            />
            <PropertyExpenseStatus
              name="Palo Alto Research Center"
              ytd="$117k"
              budget="$3.0M"
              avg="54%"
              spent="$2.1M"
              behindPace="37%"
            />
            <PropertyExpenseStatus
              name="South Bay Industrial Park"
              ytd="$126k"
              budget="$4.8M"
              avg="29%"
              spent="$3.4M"
              behindPace="39%"
            />
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Budget Analysis */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Portfolio Budget Analysis</CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="bg-blue-600 border-blue-600 text-white">
                Monthly
              </Button>
              <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                Yearly
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <BudgetAnalysisRow
            property="Stanford Graduate School of Business"
            amount="$2.8M / $4.3M"
            status="Behind pace by 31%"
            pacing="Monthly Pacing"
          />
          <BudgetAnalysisRow
            property="Mission Bay Tech Campus"
            amount="$3.8M / $5.4M"
            status="Behind pace by 31%"
            pacing="Monthly Pacing"
          />
          <BudgetAnalysisRow
            property="Redwood Shores Office Complex"
            amount="$2.7M / $3.8M"
            status="Behind pace by 36%"
            pacing="Monthly Pacing"
          />
          <BudgetAnalysisRow
            property="Palo Alto Research Center"
            amount="$2.1M / $3.0M"
            status="Behind pace by 37%"
            pacing="Monthly Pacing"
          />
          <BudgetAnalysisRow
            property="South Bay Industrial Park"
            amount="$3.4M / $4.8M"
            status="Behind pace by 39%"
            pacing="Monthly Pacing"
          />
        </CardContent>
      </Card>
    </div>
  )
}

// Helper Components
function ActionItem({ title, property, amount, status, button }: {
  title: string
  property: string
  amount: string
  status: 'urgent' | 'medium' | 'low'
  button: string
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'urgent': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`} />
        <div>
          <div className="text-sm font-medium text-white">{title}</div>
          <div className="text-xs text-gray-400">{property} • {amount}</div>
        </div>
      </div>
      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
        {button}
      </Button>
    </div>
  )
}

function PropertyExpenseStatus({ name, ytd, budget, avg, spent, behindPace }: {
  name: string
  ytd: string
  budget: string
  avg: string
  spent: string
  behindPace: string
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-white">{name}</div>
        <Badge className="bg-red-500 text-white text-xs">
          Behind pace by {behindPace}
        </Badge>
      </div>
      <div className="text-xs text-gray-400">
        YTD: {ytd} • Avg: {avg} • Budget: {budget} • Spent: {spent}
      </div>
    </div>
  )
}

function BudgetAnalysisRow({ property, amount, status, pacing }: {
  property: string
  amount: string
  status: string
  pacing: string
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-900 rounded">
      <div className="flex-1">
        <div className="text-sm font-medium text-white">{property}</div>
        <div className="text-xs text-gray-400">{amount}</div>
      </div>
      <div className="flex items-center gap-2">
        <Badge className="bg-red-500 text-white text-xs">
          {status}
        </Badge>
        <span className="text-xs text-gray-400">{pacing}</span>
      </div>
    </div>
  )
}

// Expenses Tab Component
function ExpensesTab() {
  const [selectedPeriod, setSelectedPeriod] = useState("MTD")
  const [statusFilter, setStatusFilter] = useState("All")
  const [typeFilter, setTypeFilter] = useState("All")
  const [propertyFilter, setPropertyFilter] = useState("All")
  const [madeByFilter, setMadeByFilter] = useState("All")
  const [dateFromFilter, setDateFromFilter] = useState("")
  const [dateToFilter, setDateToFilter] = useState("")
  const [showEditRules, setShowEditRules] = useState(false)
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([])

  // Mock expense data for approval
  const expensesNeedingApproval = [
    {
      id: "exp1",
      date: "2024-02-23",
      merchant: "Oracle Facilities",
      amount: 5500.00,
      type: "Vendor",
      madeBy: "Jessica Chen (Property Manager)",
      property: "Stanford Graduate School of Business",
      workOrder: "LED lighting upgrade - Building A",
      memo: "Energy efficient retrofit for entire building",
      receipt: "✓",
      status: "Flagged"
    },
    {
      id: "exp2",
      date: "2024-02-14",
      merchant: "Security Systems Inc",
      amount: 4800.00,
      type: "Vendor",
      madeBy: "David Chen (Property Manager)",
      property: "Mission Bay Tech Campus",
      workOrder: "Security system upgrade",
      memo: "Upgrade req...",
      receipt: "✓",
      status: "Flagged"
    },
    {
      id: "exp3",
      date: "2024-01-08",
      merchant: "Emergency Plumbing",
      amount: 2800.00,
      type: "Card",
      madeBy: "Mike Rodriguez (Property Manager)",
      property: "Redwood Shores Office Complex",
      workOrder: "Weekend emergency lockout service",
      memo: "Emergency t...",
      receipt: "✓",
      status: "Flagged"
    }
  ]

  // Mock processed expenses
  const processedExpenses = [
    {
      id: "exp4",
      date: "2024-02-16",
      merchant: "PlumbPro",
      amount: 1850.00,
      type: "Card",
      madeBy: "Alice Johnson (Technician)",
      property: "Financial District Tower",
      status: "Processed",
      memo: "Routine task leak fix",
      receipt: "✓"
    },
    {
      id: "exp5",
      date: "2024-02-16",
      merchant: "CleanTech Solutions",
      amount: 320.00,
      type: "Card",
      madeBy: "Bob Wilson (Technician)",
      property: "Palo Alto Research Center",
      status: "Processed",
      memo: "Monthly cleaning service",
      receipt: "✓"
    },
    {
      id: "exp6",
      date: "2024-02-16",
      merchant: "Landscaping Pro",
      amount: 12000.00,
      type: "Vendor",
      madeBy: "Sarah Kim (Property Manager)",
      property: "Apple Park Campus",
      status: "Processed",
      memo: "Quarterly maintenance",
      receipt: "✓"
    },
    {
      id: "exp7",
      date: "2024-02-15",
      merchant: "Office Depot",
      amount: 450.00,
      type: "Card",
      madeBy: "Jennifer Lopez (Technician)",
      property: "Redwood City Office",
      status: "Processed",
      memo: "Regular office supplies",
      receipt: "✓"
    }
  ]

  const handleApprove = (expenseId: string) => {
    console.log(`Approving expense: ${expenseId}`)
  }

  const handleDeny = (expenseId: string) => {
    console.log(`Denying expense: ${expenseId}`)
  }

  const handleViewDetails = (expenseId: string) => {
    console.log(`Viewing details for expense: ${expenseId}`)
  }

  const handleBulkExport = (type: 'csv' | 'receipts' | 'bookkeeper') => {
    console.log(`Bulk exporting as: ${type}`)
  }

  return (
    <div className="space-y-6">
      {/* Header and Period Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-white">Expenses</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Period:</span>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-20 bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="MTD">MTD</SelectItem>
                <SelectItem value="YTD">YTD</SelectItem>
                <SelectItem value="QTD">QTD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">$2,450,000</div>
            <div className="text-sm text-gray-400">Total Expenses (MTD)</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-400">6</div>
            <div className="text-sm text-gray-400">Need Approval</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">4</div>
            <div className="text-sm text-gray-400">Processed</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">$24,150</div>
            <div className="text-sm text-gray-400">Cashback (MTD)</div>
          </CardContent>
        </Card>
      </div>

      {/* Expense Policy Summary */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Info className="h-5 w-5" />
              Expense Policy Summary
            </CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowEditRules(!showEditRules)}
              className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Rules
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-blue-600 text-white">
              <Flag className="h-3 w-3 mr-1" />
                             Auto-flag &gt; $2,000
            </Badge>
            <Badge className="bg-green-600 text-white">
              <AlertTriangle className="h-3 w-3 mr-1" />
                             Auto-flag &gt; 10% of budget
            </Badge>
            <Badge className="bg-purple-600 text-white">
              <Receipt className="h-3 w-3 mr-1" />
              Receipts required
            </Badge>
            <Badge className="bg-yellow-600 text-white">
              <CheckCircle className="h-3 w-3 mr-1" />
                             Pre-approval &gt; $500
            </Badge>
            <Badge className="bg-red-600 text-white">
              <Zap className="h-3 w-3 mr-1" />
                             Maintenance &gt; $5K
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Export & Bookkeeping */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-blue-400" />
              <span className="text-white">Export & Bookkeeping</span>
              <Badge className="bg-gray-700 text-gray-300">0 selected</Badge>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkExport('csv')}
                className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV (0)
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkExport('receipts')}
                className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              >
                <Receipt className="h-4 w-4 mr-2" />
                Download Receipts (0)
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkExport('bookkeeper')}
                className="bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
              >
                <Send className="h-4 w-4 mr-2" />
                Send to Bookkeeper (0)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="grid grid-cols-6 gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Flagged">Flagged</SelectItem>
            <SelectItem value="Processed">Processed</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Card">Card</SelectItem>
            <SelectItem value="Vendor">Vendor</SelectItem>
          </SelectContent>
        </Select>
        <Select value={propertyFilter} onValueChange={setPropertyFilter}>
          <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
            <SelectValue placeholder="Property" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Stanford GSB">Stanford GSB</SelectItem>
            <SelectItem value="Mission Bay">Mission Bay</SelectItem>
          </SelectContent>
        </Select>
        <Select value={madeByFilter} onValueChange={setMadeByFilter}>
          <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
            <SelectValue placeholder="Made By" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="PM">Property Manager</SelectItem>
            <SelectItem value="Technician">Technician</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="date"
          value={dateFromFilter}
          onChange={(e) => setDateFromFilter(e.target.value)}
          className="bg-gray-800 border-gray-600 text-white"
          placeholder="mm/dd/yyyy"
        />
        <Input
          type="date"
          value={dateToFilter}
          onChange={(e) => setDateToFilter(e.target.value)}
          className="bg-gray-800 border-gray-600 text-white"
          placeholder="mm/dd/yyyy"
        />
      </div>

      {/* Expenses Needing Approval */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            Expenses Needing Approval (6)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-700">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Merchant</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Made By</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Property</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Work Order</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Memo</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Receipt</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expensesNeedingApproval.map((expense) => (
                  <tr key={expense.id} className="border-b border-gray-700 hover:bg-gray-700">
                    <td className="py-3 px-4 text-white">{expense.date}</td>
                    <td className="py-3 px-4 text-white">{expense.merchant}</td>
                    <td className="py-3 px-4 text-white">${expense.amount.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <Badge className={expense.type === 'Vendor' ? 'bg-purple-600' : 'bg-blue-600'}>
                        {expense.type}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-white">{expense.madeBy}</td>
                    <td className="py-3 px-4 text-white">{expense.property}</td>
                    <td className="py-3 px-4 text-white">{expense.workOrder}</td>
                    <td className="py-3 px-4 text-white">{expense.memo}</td>
                    <td className="py-3 px-4 text-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mx-auto" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(expense.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeny(expense.id)}
                          className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                        >
                          Deny
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Processed Expenses */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-400" />
            Processed Expenses (4)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-700">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Merchant</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Made By</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Property</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Memo</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Receipt</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {processedExpenses.map((expense) => (
                  <tr key={expense.id} className="border-b border-gray-700 hover:bg-gray-700">
                    <td className="py-3 px-4 text-white">{expense.date}</td>
                    <td className="py-3 px-4 text-white">{expense.merchant}</td>
                    <td className="py-3 px-4 text-white">${expense.amount.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <Badge className={expense.type === 'Vendor' ? 'bg-purple-600' : 'bg-blue-600'}>
                        {expense.type}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-white">{expense.madeBy}</td>
                    <td className="py-3 px-4 text-white">{expense.property}</td>
                    <td className="py-3 px-4">
                      <Badge className="bg-green-600 text-white">
                        {expense.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-white">{expense.memo}</td>
                    <td className="py-3 px-4 text-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mx-auto" />
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(expense.id)}
                        className="bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* All Expenses Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">All Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-4 mb-4">
            <Select>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="vendor">Vendor</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Property" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="stanford">Stanford GSB</SelectItem>
                <SelectItem value="mission">Mission Bay</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Made By" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pm">Property Manager</SelectItem>
                <SelectItem value="tech">Technician</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="mm/dd/yyyy"
            />
            <Input
              type="date"
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="mm/dd/yyyy"
            />
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-700">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Vendor</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Made By</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Property</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Memo</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Receipt</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-700">
                  <td className="py-3 px-4 text-white">2024-02-20</td>
                  <td className="py-3 px-4 text-white">ServiceMaster</td>
                  <td className="py-3 px-4 text-white">$750.00</td>
                  <td className="py-3 px-4">
                    <Badge className="bg-purple-600">Vendor</Badge>
                  </td>
                  <td className="py-3 px-4 text-white">Jessica Chen (Property Manager)</td>
                  <td className="py-3 px-4 text-white">Stanford Graduate School of Business</td>
                  <td className="py-3 px-4">
                    <Badge className="bg-yellow-600">Pending</Badge>
                  </td>
                  <td className="py-3 px-4 text-white">Critical system failure during finals week. Temporary solution in place.</td>
                  <td className="py-3 px-4 text-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mx-auto" />
                  </td>
                  <td className="py-3 px-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-3 px-4 text-white">2024-02-19</td>
                  <td className="py-3 px-4 text-white">Elevator Services Inc.</td>
                  <td className="py-3 px-4 text-white">$200.00</td>
                  <td className="py-3 px-4">
                    <Badge className="bg-purple-600">Vendor</Badge>
                  </td>
                  <td className="py-3 px-4 text-white">Michael Rodriguez (Property Manager)</td>
                  <td className="py-3 px-4 text-white">Mission Bay Tech Center</td>
                  <td className="py-3 px-4">
                    <Badge className="bg-red-600">Not Uploaded</Badge>
                  </td>
                  <td className="py-3 px-4 text-white">City inspector flagged elevator safety issues. Accommodation required for compliance.</td>
                  <td className="py-3 px-4 text-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mx-auto" />
                  </td>
                  <td className="py-3 px-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-3 px-4 text-white">2024-02-18</td>
                  <td className="py-3 px-4 text-white">PlumbPro</td>
                  <td className="py-3 px-4 text-white">$1950.00</td>
                  <td className="py-3 px-4">
                    <Badge className="bg-blue-600">Card</Badge>
                  </td>
                  <td className="py-3 px-4 text-white">Alice Johnson (Technician)</td>
                  <td className="py-3 px-4 text-white">Financial District Tower</td>
                  <td className="py-3 px-4">
                    <Badge className="bg-green-600">Processed</Badge>
                  </td>
                  <td className="py-3 px-4 text-white">Routine task, no structural damage.</td>
                  <td className="py-3 px-4 text-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mx-auto" />
                  </td>
                  <td className="py-3 px-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-3 px-4 text-white">2024-02-17</td>
                  <td className="py-3 px-4 text-white">Oracle Facilities</td>
                  <td className="py-3 px-4 text-white">$900.00</td>
                  <td className="py-3 px-4">
                    <Badge className="bg-purple-600">Vendor</Badge>
                  </td>
                  <td className="py-3 px-4 text-white">Jessica Chen (Property Manager)</td>
                  <td className="py-3 px-4 text-white">Redwood Shores Office Complex</td>
                  <td className="py-3 px-4">
                    <Badge className="bg-green-600">Processed</Badge>
                  </td>
                  <td className="py-3 px-4 text-white">Energy efficiency upgrade with strong ROI projections.</td>
                  <td className="py-3 px-4 text-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mx-auto" />
                  </td>
                  <td className="py-3 px-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function PropertiesTab() {
  const properties = [
    {
      id: 1,
      name: "Stanford Graduate School of Business",
      address: "655 Knight Way, Stanford, CA 94305",
      manager: {
        name: "Sarah Chen",
        email: "sarah.chen@stanford.edu",
        phone: "(650) 723-2146"
      },
      type: "Academic",
      size: "285,000 sq ft",
      budgetPacing: 132,
      behindPace: 32,
      ytdSpent: "$2.8M",
      annualBudget: "$4.3M"
    },
    {
      id: 2,
      name: "Mission Bay Tech Campus",
      address: "1700 Owens Street, San Francisco, CA 94158",
      manager: {
        name: "Marcus Rodriguez",
        email: "marcus.rodriguez@consult.com",
        phone: "(415) 555-0123"
      },
      type: "Office",
      size: "450,000 sq ft",
      budgetPacing: 131,
      behindPace: 31,
      ytdSpent: "$3.8M",
      annualBudget: "$5.4M"
    },
    {
      id: 3,
      name: "Redwood Shores Office Complex",
      address: "500 Oracle Parkway, Redwood City, CA 94065",
      manager: {
        name: "Sarah Kim",
        email: "sarah.kim@oracle.com",
        phone: "(650) 506-7000"
      },
      type: "Office",
      size: "320,000 sq ft",
      budgetPacing: 138,
      behindPace: 38,
      ytdSpent: "$2.7M",
      annualBudget: "$3.8M"
    },
    {
      id: 4,
      name: "Palo Alto Research Center",
      address: "3333 Coyote Hill Road, Palo Alto, CA 94304",
      manager: {
        name: "David Rodriguez",
        email: "david.rodriguez@xerox.com",
        phone: "(650) 812-4000"
      },
      type: "Research",
      size: "200,000 sq ft",
      budgetPacing: 137,
      behindPace: 37,
      ytdSpent: "$2.1M",
      annualBudget: "$3.0M"
    },
    {
      id: 5,
      name: "South Bay Industrial Park",
      address: "1000 Innovation Drive, San Jose, CA 95110",
      manager: {
        name: "Angela Martinez",
        email: "angela.martinez@seogate.com",
        phone: "(408) 555-7890"
      },
      type: "Industrial",
      size: "600,000 sq ft",
      budgetPacing: 139,
      behindPace: 39,
      ytdSpent: "$3.4M",
      annualBudget: "$4.8M"
    }
  ]

  const handleViewExpenses = (propertyId: number) => {
    console.log(`Viewing expenses for property ${propertyId}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Properties</h2>
        <div className="text-sm text-gray-400">
          5 properties • $21.3M total budget
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {properties.map((property) => (
          <Card key={property.id} className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-white mb-1">
                    {property.name}
                  </CardTitle>
                  <p className="text-sm text-gray-400">{property.address}</p>
                </div>
                <Badge className="bg-red-500 text-white text-xs ml-2">
                  Behind pace by {property.behindPace}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Property Manager */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-300">Property Manager</h4>
                <div className="text-sm text-white">
                  <div className="font-medium">{property.manager.name}</div>
                  <div className="text-gray-400">{property.manager.email}</div>
                  <div className="text-gray-400">{property.manager.phone}</div>
                </div>
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-1">Type</h4>
                  <p className="text-sm text-white">{property.type}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-1">Size</h4>
                  <p className="text-sm text-white">{property.size}</p>
                </div>
              </div>

              {/* Budget Pacing */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-300">Budget Pacing</h4>
                  <Info className="h-4 w-4 text-gray-500" />
                </div>
                <div className="text-2xl font-bold text-red-400">{property.budgetPacing}%</div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${Math.min(property.budgetPacing, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Behind pace by {property.behindPace}%</span>
                  <span>Trending up</span>
                </div>
              </div>

              {/* YTD vs Budget */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-300">YTD Spend</h4>
                  <h4 className="text-sm font-medium text-gray-300">Annual Budget</h4>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-white">{property.ytdSpent}</span>
                  <span className="text-lg font-bold text-white">{property.annualBudget}</span>
                </div>
              </div>

              {/* View Expenses Button */}
              <Button
                className="w-full bg-gray-700 hover:bg-gray-600 text-white"
                onClick={() => handleViewExpenses(property.id)}
              >
                View Expenses
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ForecastingTab() {
  const [selectedPeriod, setSelectedPeriod] = useState("Monthly")
  const [dateRange, setDateRange] = useState("Rest of 2024")
  const [showAddExpense, setShowAddExpense] = useState(false)

  // Mock data for the chart
  const monthlyData = [
    { month: 'Jan', actual: 1200000, forecast: 1250000, budget: 1300000 },
    { month: 'Feb', actual: 1150000, forecast: 1200000, budget: 1280000 },
    { month: 'Mar', actual: 1300000, forecast: 1350000, budget: 1400000 },
    { month: 'Apr', actual: 1100000, forecast: 1150000, budget: 1200000 },
    { month: 'May', actual: 1250000, forecast: 1300000, budget: 1350000 },
    { month: 'Jun', actual: 1180000, forecast: 1220000, budget: 1250000 },
    { month: 'Jul', actual: 0, forecast: 1400000, budget: 1450000 },
    { month: 'Aug', actual: 0, forecast: 1350000, budget: 1400000 },
    { month: 'Sep', actual: 0, forecast: 1300000, budget: 1350000 },
    { month: 'Oct', actual: 0, forecast: 1250000, budget: 1300000 },
    { month: 'Nov', actual: 0, forecast: 1200000, budget: 1250000 },
    { month: 'Dec', actual: 0, forecast: 1150000, budget: 1200000 }
  ]

  const upcomingExpenses = [
    {
      id: 1,
      property: "Redwood Shores",
      date: "12/14/2024",
      category: "Maintenance",
      amount: 18500,
      source: "Smart Insights"
    },
    {
      id: 2,
      property: "Mission Bay",
      date: "1/7/2025",
      category: "Capital Improvements",
      amount: 45000,
      source: "Contract"
    },
    {
      id: 3,
      property: "Skyline Vista",
      date: "1/31/2025",
      category: "Recurring OpEx",
      amount: 12000,
      source: "Manual Entry"
    }
  ]

  const handleExportReport = () => {
    console.log("Exporting forecast report")
  }

  const handleAddExpense = () => {
    setShowAddExpense(true)
  }

  const handleEditExpense = (id: number) => {
    console.log(`Editing expense ${id}`)
  }

  const handleViewInExpenses = () => {
    console.log("Viewing in expenses")
  }

  const handleAdjustForecast = () => {
    console.log("Adjusting forecast")
  }

  const handleApplyRecommendation = (type: string) => {
    console.log(`Applying recommendation: ${type}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Forecasting</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Date Range:</span>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-32 bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="Rest of 2024">Rest of 2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="Next 6 months">Next 6 months</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleExportReport}
          >
            Export Forecast Report
          </Button>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-sm text-gray-400 mb-1">Forecasted Spend</div>
            <div className="text-2xl font-bold text-white">$8,615,500</div>
            <div className="text-xs text-gray-500 mt-1">Total Forecasted</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-sm text-gray-400 mb-1">Remaining Budget</div>
            <div className="text-2xl font-bold text-green-400">$12,684,500</div>
            <div className="text-xs text-gray-500 mt-1">Remaining Budget</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-sm text-gray-400 mb-1">Delta vs. Budget</div>
            <div className="text-2xl font-bold text-red-400">+$12,684,500</div>
            <div className="text-xs text-gray-500 mt-1">Delta vs. Budget</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-sm text-gray-400 mb-1">Risk Level</div>
            <Badge className="bg-orange-600 text-white">Medium Risk</Badge>
            <div className="text-xs text-gray-500 mt-1">1 properties exceed budget threshold</div>
            <div className="text-xs text-gray-500">Action required on flagged properties</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spend Curve */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Spend Curve</CardTitle>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setSelectedPeriod("Monthly")}
                  className={selectedPeriod === "Monthly" ? "bg-blue-600 border-blue-600 text-white" : "border-gray-600 text-gray-300"}
                >
                  Monthly
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setSelectedPeriod("Quarterly")}
                  className={selectedPeriod === "Quarterly" ? "bg-blue-600 border-blue-600 text-white" : "border-gray-600 text-gray-300"}
                >
                  Quarterly
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: '#374151', 
                      border: '1px solid #4B5563',
                      borderRadius: '6px',
                      color: '#ffffff'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    name="Actual"
                    dot={{ fill: '#3B82F6' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="forecast" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Forecast"
                    dot={{ fill: '#8B5CF6' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="budget" 
                    stroke="#EF4444" 
                    strokeWidth={2}
                    name="Budget"
                    dot={{ fill: '#EF4444' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Risk Level */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Risk Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-lg font-bold text-orange-400">Medium Risk</span>
            </div>
            <div className="text-sm text-gray-400 mb-4">
              1 properties exceed budget threshold
            </div>
            <div className="text-sm text-gray-400 mb-4">
              Action required on flagged properties
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Expenses */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Upcoming Expenses</CardTitle>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleAddExpense}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Projected Expense
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-700">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Property</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Source</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {upcomingExpenses.map((expense) => (
                  <tr key={expense.id} className="border-b border-gray-700 hover:bg-gray-700">
                    <td className="py-3 px-4 text-white">{expense.property}</td>
                    <td className="py-3 px-4 text-white">{expense.date}</td>
                    <td className="py-3 px-4">
                      <Badge className={
                        expense.category === 'Maintenance' ? 'bg-blue-600' :
                        expense.category === 'Capital Improvements' ? 'bg-purple-600' :
                        'bg-green-600'
                      }>
                        {expense.category}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-white">${expense.amount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-white">{expense.source}</td>
                    <td className="py-3 px-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditExpense(expense.id)}
                        className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Risk Alerts */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Risk Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-orange-400" />
              <span className="font-semibold text-orange-300">Medium Risk</span>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              Redwood Shores projected to exceed budget by $42K in November. Drivers: Maintenance (65%), Unexpected Repairs (35%)
            </p>
            <div className="text-sm text-gray-400 mb-4">
              Maintenance 65% Unexpected Repairs 35%
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleViewInExpenses}
                className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              >
                View in Expenses
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleAdjustForecast}
                className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              >
                Adjust Forecast
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Smart Forecast Recommendations */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Smart Forecast Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Cost Optimization */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-5 w-5 text-blue-400" />
              <span className="font-semibold text-blue-300">Cost Optimization</span>
            </div>
            <h4 className="font-medium text-white mb-2">Delay elevator modernization → save $45K (Q1 2025)</h4>
            <p className="text-sm text-gray-300 mb-4">
              Delay Mission Bay elevator modernization to Q1 2025 to reduce current quarter spend and improve cash flow
            </p>
            <div className="text-sm text-gray-400 mb-4">
              Potential savings: $45K | Risk level: Low
            </div>
            <Button
              size="sm"
              onClick={() => handleApplyRecommendation('delay-elevator')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Apply Recommendation
            </Button>
          </div>

          {/* Budget Opportunity */}
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <span className="font-semibold text-green-300">Budget Opportunity</span>
            </div>
            <h4 className="font-medium text-white mb-2">Advance HVAC upgrade at Skyline Vista → use remaining budget</h4>
            <p className="text-sm text-gray-300 mb-4">
              Skyline Vista is significantly under budget. Consider advancing planned HVAC efficiency upgrades to capture winter rates
            </p>
            <div className="text-sm text-gray-400 mb-4">
              Available budget: $32K | Recommended action: advance
            </div>
            <Button
              size="sm"
              onClick={() => handleApplyRecommendation('advance-hvac')}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Apply Recommendation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SmartInsightsTab() {
  const [selectedBenchmark, setSelectedBenchmark] = useState("property")
  const [roiCalcForm, setRoiCalcForm] = useState({
    assetType: "",
    actionType: "",
    cost: "",
    opex: ""
  })
  const [aiQuery, setAiQuery] = useState("")
  const [showRoiCalculator, setShowRoiCalculator] = useState(false)

  const handleAiQuestion = (question: string) => {
    setAiQuery(question)
    console.log(`AI Query: ${question}`)
  }

  const handleRoiCalculation = () => {
    console.log("Calculating ROI", roiCalcForm)
  }

  const benchmarkingData = [
    {
      category: "HVAC",
      actual: 12500,
      market: 9800,
      cleanSheet: 8200,
      portfolio: 11200,
      overCleanSheet: "52%",
      recommendations: ["Negotiate vendor contracts", "Vendor consolidation"]
    },
    {
      category: "Elevator",
      actual: 8200,
      market: 7100,
      cleanSheet: 6500,
      portfolio: 7800,
      overCleanSheet: "26%",
      recommendations: ["Contract optimization", "Preventive maintenance"]
    },
    {
      category: "Fire Safety",
      actual: 5400,
      market: 4900,
      cleanSheet: 4200,
      portfolio: 5100,
      overCleanSheet: "29%",
      recommendations: ["Multi-year contracts", "Vendor negotiation"]
    },
    {
      category: "Plumbing",
      actual: 7800,
      market: 6900,
      cleanSheet: 5800,
      portfolio: 7200,
      overCleanSheet: "34%",
      recommendations: ["Emergency service rates", "Vendor consolidation"]
    },
    {
      category: "General R&M",
      actual: 15200,
      market: 13800,
      cleanSheet: 11500,
      portfolio: 14100,
      overCleanSheet: "32%",
      recommendations: ["Contract standardization", "Vendor performance"]
    }
  ]

  const costBenchmarkingSummary = [
    { category: "Total R&M", perSqFt: "$18.2", variance: "12%", performance: "Below Market" },
    { category: "HVAC", perSqFt: "$8.4", variance: "15%", performance: "Behind" },
    { category: "Market Average", perSqFt: "$16.2", variance: "8%", performance: "Baseline" },
    { category: "Savings", perSqFt: "$1.85/sq ft", variance: "7%", performance: "Potential" },
    { category: "Electrical", perSqFt: "$4.2", variance: "9%", performance: "On Track" }
  ]

  const recentAnalyses = [
    {
      type: "HVAC System - Building A",
      result: "2.3 year payback",
      savings: "44 years",
      status: "Approved"
    },
    {
      type: "Leak Detection System",
      result: "5.2 year payback",
      savings: "8.3 years",
      status: "Approved"
    }
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Smart Insights</h2>

      {/* Portfolio Performance */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Portfolio Performance</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">69%</div>
            <div className="text-sm text-gray-400">of budget used</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">$5.6M</div>
            <div className="text-sm text-gray-400">saved vs clean sheet</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-400 mb-2">3</div>
            <div className="text-sm text-gray-400">properties over budget</div>
          </div>
        </CardContent>
      </Card>

      {/* Ask AI Panel */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Bot className="h-5 w-5 text-purple-400" />
            Ask AI Smart Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <Button
              variant="outline"
              className="justify-start h-auto p-3 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              onClick={() => handleAiQuestion("How much did we spend on R&M across all properties in Q1?")}
            >
              <span className="text-sm">How much did we spend on R&M across all properties in Q1?</span>
            </Button>
            <Button
              variant="outline"
              className="justify-start h-auto p-3 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              onClick={() => handleAiQuestion("Which vendors have the highest cost per service call?")}
            >
              <span className="text-sm">Which vendors have the highest cost per service call?</span>
            </Button>
            <Button
              variant="outline"
              className="justify-start h-auto p-3 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              onClick={() => handleAiQuestion("Show me all emergency repairs over $5K this year")}
            >
              <span className="text-sm">Show me all emergency repairs over $5K this year</span>
            </Button>
            <Button
              variant="outline"
              className="justify-start h-auto p-3 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              onClick={() => handleAiQuestion("What did we reimburse late we should have caught?")}
            >
              <span className="text-sm">What did we reimburse late we should have caught?</span>
            </Button>
            <Button
              variant="outline"
              className="justify-start h-auto p-3 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              onClick={() => handleAiQuestion("Which category has the highest variance?")}
            >
              <span className="text-sm">Which category has the highest variance?</span>
            </Button>
            <Button
              variant="outline"
              className="justify-start h-auto p-3 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              onClick={() => handleAiQuestion("What are our biggest budget overruns by category?")}
            >
              <span className="text-sm">What are our biggest budget overruns by category?</span>
            </Button>
            <Button
              variant="outline"
              className="justify-start h-auto p-3 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              onClick={() => handleAiQuestion("What are the top 3 urgent recommendations?")}
            >
              <span className="text-sm">What are the top 3 urgent recommendations?</span>
            </Button>
            <Button
              variant="outline"
              className="justify-start h-auto p-3 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              onClick={() => handleAiQuestion("What's the real R&M spend 3x benchmark vs primary?")}
            >
              <span className="text-sm">What's the real R&M spend 3x benchmark vs primary?</span>
            </Button>
          </div>
          <div className="mt-4">
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => setShowRoiCalculator(!showRoiCalculator)}
            >
              <Calculator className="h-4 w-4 mr-2" />
              ROI Calculator
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Cost Benchmarking */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Interactive Cost Benchmarking</CardTitle>
          <p className="text-sm text-gray-400">
            Compare your costs against the market and optimize spending with Smart Insights
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {benchmarkingData.map((item, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-white">{item.category}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Versus: Market Median, Clean Sheet Pro, Chambre Diversified</span>
                    <span className="text-sm font-bold text-red-400">{item.overCleanSheet} over clean sheet</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <div className="text-xs text-gray-400">Actual</div>
                    <div className="bg-blue-600 h-8 rounded flex items-center justify-center text-white text-sm">
                      ${item.actual.toLocaleString()}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs text-gray-400">Market</div>
                    <div className="bg-gray-600 h-8 rounded flex items-center justify-center text-white text-sm">
                      ${item.market.toLocaleString()}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs text-gray-400">Clean Sheet</div>
                    <div className="bg-green-600 h-8 rounded flex items-center justify-center text-white text-sm">
                      ${item.cleanSheet.toLocaleString()}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs text-gray-400">Portfolio</div>
                    <div className="bg-purple-600 h-8 rounded flex items-center justify-center text-white text-sm">
                      ${item.portfolio.toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {item.recommendations.map((rec, recIndex) => (
                    <Badge key={recIndex} className="bg-orange-600 text-white">
                      {rec}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex gap-4">
            <Button variant="outline" className="bg-gray-700 border-gray-600 text-white">
              Export CSV
            </Button>
            <Button variant="outline" className="bg-gray-700 border-gray-600 text-white">
              Export PDF
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Drill Down by Property
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cost Benchmarking Summary */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Cost Benchmarking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-700">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Per Sq Ft</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Variance</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Performance</th>
                </tr>
              </thead>
              <tbody>
                {costBenchmarkingSummary.map((item, index) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="py-3 px-4 text-white">{item.category}</td>
                    <td className="py-3 px-4 text-white">{item.perSqFt}</td>
                    <td className="py-3 px-4 text-white">{item.variance}</td>
                    <td className="py-3 px-4">
                      <Badge 
                        className={
                          item.performance === "On Track" ? "bg-green-600" :
                          item.performance === "Potential" ? "bg-blue-600" :
                          item.performance === "Baseline" ? "bg-gray-600" :
                          "bg-red-600"
                        }
                      >
                        {item.performance}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ROI Calculator */}
      {showRoiCalculator && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calculator className="h-5 w-5 text-green-400" />
              ROI Calculator
            </CardTitle>
            <p className="text-sm text-gray-400">
              Calculate returns on property maintenance decisions
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-white">Calculation Inputs</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Asset Type</Label>
                    <Select value={roiCalcForm.assetType} onValueChange={(value) => setRoiCalcForm(prev => ({ ...prev, assetType: value }))}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select asset" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="hvac">HVAC System</SelectItem>
                        <SelectItem value="elevator">Elevator</SelectItem>
                        <SelectItem value="plumbing">Plumbing</SelectItem>
                        <SelectItem value="electrical">Electrical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-300">Action Type</Label>
                    <Select value={roiCalcForm.actionType} onValueChange={(value) => setRoiCalcForm(prev => ({ ...prev, actionType: value }))}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select action" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="replace">Replace</SelectItem>
                        <SelectItem value="repair">Repair</SelectItem>
                        <SelectItem value="upgrade">Upgrade</SelectItem>
                        <SelectItem value="maintain">Maintain</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Estimated Cost</Label>
                    <Input
                      type="number"
                      value={roiCalcForm.cost}
                      onChange={(e) => setRoiCalcForm(prev => ({ ...prev, cost: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="$0"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Est. Annual OpEx</Label>
                    <Input
                      type="number"
                      value={roiCalcForm.opex}
                      onChange={(e) => setRoiCalcForm(prev => ({ ...prev, opex: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="$0"
                    />
                  </div>
                </div>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleRoiCalculation}
                >
                  Calculate ROI
                </Button>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-white">Recent Analyses</h4>
                <div className="space-y-3">
                  {recentAnalyses.map((analysis, index) => (
                    <div key={index} className="p-3 bg-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">{analysis.type}</span>
                        <Badge className="bg-green-600 text-white">{analysis.status}</Badge>
                      </div>
                      <div className="text-xs text-gray-400">
                        {analysis.result} • {analysis.savings}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function ReimbursementsTab() {
  const [selectedPacket, setSelectedPacket] = useState<string | null>(null)
  const [showProcessModal, setShowProcessModal] = useState(false)
  const [processForm, setProcessForm] = useState({
    workOrder: "HVAC System Maintenance - Annual Service",
    jobId: "#job1",
    amount: "241.00",
    notes: "",
    ownerName: "Stanford GSB Administration",
    ownerPhone: "650-725-3341",
    ownerEmail: "owner@stanford.edu",
    ccEmail: "",
    attachReport: false
  })

  const trustAccounts = [
    {
      id: "redwood",
      name: "Redwood Shores Office Complex",
      accountId: "TA-2024-001",
      currentBalance: 285000,
      ytdDeposits: 450000,
      ytdWithdrawals: 165000,
      pendingReimbursements: 0,
      requiresApproval: true,
      approvalMessage: "Requires approval to release funds"
    },
    {
      id: "mission",
      name: "Mission Bay Tech Campus",
      accountId: "TA-2024-002",  
      currentBalance: 195000,
      ytdDeposits: 320000,
      ytdWithdrawals: 125000,
      pendingReimbursements: 0,
      requiresApproval: true,
      approvalMessage: "Requires approval to release funds"
    },
    {
      id: "skyline",
      name: "Skyline Vista",
      accountId: "TA-2024-003",
      currentBalance: 125000,
      ytdDeposits: 200000,
      ytdWithdrawals: 75000,
      pendingReimbursements: 0,
      requiresApproval: false,
      approvalMessage: null
    }
  ]

  const reimbursementPackets = [
    {
      id: "RMB-2024-001",
      status: "PENDING REVIEW",
      submittedBy: "Sarah Johnson",
      submittedDate: "6/30/2024",
      total: 45650,
      expenseCount: 4,
      trustBalance: 285000,
      releaseAmount: 45650,
      remainingBalance: 239350,
      flaggedItems: [
        "Bay Area HVAC Solutions: Over $15K threshold",
        "Pacific Landscaping: Missing receipt"
      ],
      expenses: [
        {
          id: "exp1",
          vendor: "Bay Area HVAC Solutions",
          amount: 18500,
          category: "Emergency Repairs",
          glCode: "REP-HVAC",
          receipt: true,
          flagged: true,
          status: "Uploaded"
        },
        {
          id: "exp2", 
          vendor: "Citywide Cleaning Services",
          amount: 12450,
          category: "Operations",
          glCode: "OPS-CLEAN",
          receipt: true,
          flagged: false,
          status: "Uploaded"
        },
        {
          id: "exp3",
          vendor: "Elite Security Systems",
          amount: 8750,
          category: "Capital Improvements",
          glCode: "CAP-SEC",
          receipt: true,
          flagged: false,
          status: "Uploaded"
        },
        {
          id: "exp4",
          vendor: "Pacific Landscaping",
          amount: 6000,
          category: "Operations",
          glCode: "OPS-LAND",
          receipt: false,
          flagged: true,
          status: "Missing"
        }
      ]
    },
    {
      id: "RMB-2024-002",
      status: "PENDING REVIEW",
      submittedBy: "James Wilson",
      submittedDate: "7/1/2024",
      total: 23750,
      expenseCount: 2,
      trustBalance: 195000,
      releaseAmount: -23750,
      remainingBalance: 171250,
      flaggedItems: [
        "Metro Office Supplies: Non-billable expense over $5K"
      ],
      expenses: [
        {
          id: "exp5",
          vendor: "TechFlow Plumbing",
          amount: 15250,
          category: "Emergency Repairs",
          glCode: "REP-PLUMB",
          receipt: true,
          flagged: false,
          status: "Uploaded"
        },
        {
          id: "exp6",
          vendor: "Metro Office Supplies",
          amount: 8500,
          category: "Operations",
          glCode: "OPS-SUPP",
          receipt: true,
          flagged: true,
          status: "Flagged"
        }
      ]
    }
  ]

  const handleApprovePacket = (packetId: string) => {
    console.log(`Approving packet: ${packetId}`)
  }

  const handleRejectPacket = (packetId: string) => {
    console.log(`Rejecting packet: ${packetId}`)
  }

  const handleProcessReimbursement = () => {
    console.log("Processing reimbursement", processForm)
    setShowProcessModal(false)
  }

  const handleExportPDF = (packetId: string) => {
    console.log(`Exporting PDF for packet: ${packetId}`)
  }

  const handleViewDetails = (packetId: string) => {
    console.log(`Viewing details for packet: ${packetId}`)
  }

  const handleViewHistory = (packetId: string) => {
    console.log(`Viewing history for packet: ${packetId}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Owner Reimbursements</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">2 packets pending review</span>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Export Report
          </Button>
        </div>
      </div>

      {/* Trust Account Balances */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Trust Account Balances</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trustAccounts.map((account) => (
            <Card key={account.id} className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium text-white">
                  {account.name}
                </CardTitle>
                <p className="text-xs text-gray-400">Account ID: {account.accountId}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    ${account.currentBalance.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400">Current Balance</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="text-gray-400">YTD Deposits</div>
                    <div className="text-green-400 font-medium">
                      ${account.ytdDeposits.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">YTD Withdrawals</div>
                    <div className="text-red-400 font-medium">
                      ${account.ytdWithdrawals.toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <div className="text-xs">
                  <div className="text-gray-400">Pending Reimbursements</div>
                  <div className="text-white font-medium">
                    ${account.pendingReimbursements.toLocaleString()}
                  </div>
                </div>
                
                {account.requiresApproval && (
                  <div className="bg-red-900/20 border border-red-500/30 rounded p-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                      <span className="text-xs text-red-300">
                        {account.approvalMessage}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Pending Reimbursement Packets */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Pending Reimbursement Packets</h3>
        <p className="text-sm text-gray-400">Review and approve PM expense submissions to trust accounts</p>
        
        {reimbursementPackets.map((packet) => (
          <Card key={packet.id} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center gap-2">
                    {packet.id}
                    <Badge className="bg-yellow-600 text-white">{packet.status}</Badge>
                  </CardTitle>
                  <p className="text-sm text-gray-400">
                    {packet.submittedBy} • Submitted by {packet.submittedBy} on {packet.submittedDate}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    ${packet.total.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400">
                    {packet.expenseCount} expense(s)
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Trust Account Impact Preview */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Trust Account Impact Preview
                </h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Current Balance</div>
                    <div className="text-white font-medium">
                      ${packet.trustBalance.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Release Amount</div>
                    <div className="text-white font-medium">
                      ${packet.releaseAmount.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Remaining Balance</div>
                    <div className="text-white font-medium">
                      ${packet.remainingBalance.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Flagged Items */}
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <span className="font-medium text-red-300">Items Requiring Attention</span>
                </div>
                <ul className="text-sm text-red-200 space-y-1">
                  {packet.flaggedItems.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>

              {/* Expense Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-700">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-300">Vendor</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-300">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-300">Category</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-300">GL Code</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-300">Receipt</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-300">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packet.expenses.map((expense) => (
                      <tr key={expense.id} className="border-b border-gray-700">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {expense.flagged && (
                              <AlertTriangle className="h-4 w-4 text-yellow-400" />
                            )}
                            <span className="text-white">{expense.vendor}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-white">
                          ${expense.amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-white">{expense.category}</td>
                        <td className="py-3 px-4 text-white">{expense.glCode}</td>
                        <td className="py-3 px-4 text-center">
                          {expense.receipt ? (
                            <CheckCircle className="h-4 w-4 text-green-400 mx-auto" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-400 mx-auto" />
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={
                            expense.status === "Uploaded" ? "bg-green-600" :
                            expense.status === "Flagged" ? "bg-yellow-600" :
                            "bg-red-600"
                          }>
                            {expense.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Trust Account Impact Summary */}
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Trust Account Impact</span>
                  <span className="text-white">
                    TA-2024-001 • Current Balance: ${packet.trustBalance.toLocaleString()}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  After withdrawal: ${packet.remainingBalance.toLocaleString()}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleViewDetails(packet.id)}
                  className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleViewHistory(packet.id)}
                  className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  View History
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExportPDF(packet.id)}
                  className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleRejectPacket(packet.id)}
                  className="bg-red-600 border-red-600 text-white hover:bg-red-700"
                >
                  Reject Packet
                </Button>
                <Button
                  onClick={() => handleApprovePacket(packet.id)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Approve Full Packet
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Process Reimbursement Modal */}
      <Dialog open={showProcessModal} onOpenChange={setShowProcessModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Process Reimbursement</DialogTitle>
            <DialogDescription className="text-gray-400">
              Review and process reimbursement for this work order
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Work Order</Label>
              <div className="text-white font-medium">{processForm.workOrder}</div>
              <div className="text-gray-400 text-sm">{processForm.jobId}</div>
            </div>
            
            <div>
              <Label className="text-gray-300">Reimbursement Amount</Label>
              <div className="text-2xl font-bold text-white">${processForm.amount}</div>
            </div>
            
            <div>
              <Label className="text-gray-300">Notes</Label>
              <Textarea
                value={processForm.notes}
                onChange={(e) => setProcessForm(prev => ({ ...prev, notes: e.target.value }))}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="Add any notes about this reimbursement..."
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-gray-300">Owner Contact Information</Label>
              <div className="space-y-2">
                <div>
                  <Label className="text-gray-300 text-sm">Owner Name</Label>
                  <Input
                    value={processForm.ownerName}
                    onChange={(e) => setProcessForm(prev => ({ ...prev, ownerName: e.target.value }))}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300 text-sm">Owner Phone</Label>
                  <Input
                    value={processForm.ownerPhone}
                    onChange={(e) => setProcessForm(prev => ({ ...prev, ownerPhone: e.target.value }))}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300 text-sm">Owner Email</Label>
                  <Input
                    value={processForm.ownerEmail}
                    onChange={(e) => setProcessForm(prev => ({ ...prev, ownerEmail: e.target.value }))}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <Label className="text-gray-300">CC Email (Optional)</Label>
              <Input
                value={processForm.ccEmail}
                onChange={(e) => setProcessForm(prev => ({ ...prev, ccEmail: e.target.value }))}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="Additional email to notify"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="attach-report"
                checked={processForm.attachReport}
                onCheckedChange={(checked) => setProcessForm(prev => ({ ...prev, attachReport: checked }))}
              />
              <Label htmlFor="attach-report" className="text-gray-300">
                Attach monthly report with comments
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowProcessModal(false)}
              className="border-gray-600 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleProcessReimbursement}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Process Reimbursement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ReportingTab() {
  const [dateRange, setDateRange] = useState({ from: "", to: "" })
  const [selectedProperties, setSelectedProperties] = useState<string[]>([])
  const [selectedGLCodes, setSelectedGLCodes] = useState<string[]>([])
  const [selectedExpenseStatus, setSelectedExpenseStatus] = useState<string[]>([])
  const [selectedTrustAccount, setSelectedTrustAccount] = useState("all")
  const [reportType, setReportType] = useState("trust-reconciliation")
  const [isGenerating, setIsGenerating] = useState(false)

  const propertyOptions = [
    "Stanford Graduate School of Business",
    "Mission Bay Tech Campus", 
    "Redwood Shores Office Complex",
    "Palo Alto Research Center",
    "South Bay Industrial Park"
  ]

  const glCodeOptions = [
    "REP-HVAC", "REP-PLUMB", "REP-ELEC", "REP-GEN",
    "OPS-CLEAN", "OPS-LAND", "OPS-SUPP", "OPS-MAINT",
    "CAP-SEC", "CAP-HVAC", "CAP-ELEC", "CAP-BLDG",
    "ADMIN-MGMT", "ADMIN-LEGAL", "ADMIN-ACCT"
  ]

  const expenseStatusOptions = [
    "Flagged", "Approved", "Missing Receipt", "Pending Review", "Processed"
  ]

  const trustAccountOptions = [
    "TA-2024-001 (Redwood Shores)",
    "TA-2024-002 (Mission Bay)",
    "TA-2024-003 (Skyline Vista)"
  ]

  const reportTypes = [
    {
      id: "trust-reconciliation",
      name: "Trust Account Reconciliation Report",
      description: "Lists all withdrawals, reimbursements, and trust balances by property. Tracks packet approvals, flagged items, and final balance snapshot. Includes PM and Owner notes."
    },
    {
      id: "tax-deduction",
      name: "Tax Deduction Summary",
      description: "Breaks down expenses by deductible/non-deductible GL categories. Totals by property and time period. CSV includes memo fields, category mapping, and receipt links."
    },
    {
      id: "flagged-expenses",
      name: "Flagged Expense Report",
      description: "Includes all items auto- or manually-flagged. Lists policy rule violated (e.g. over $2K, missing receipt, >10% budget). Includes comments, property, GL, amount, flag type, and reviewer."
    },
    {
      id: "cost-savings",
      name: "Cost-Saving Summary Report",
      description: "Shows Smart Insight savings suggestions accepted/rejected. Itemized view of projected vs realized savings per suggestion. Groups by category and property."
    }
  ]

  const handleGenerateReport = async (format: 'csv' | 'pdf') => {
    setIsGenerating(true)
    
    // Simulate report generation
    const selectedReportType = reportTypes.find(r => r.id === reportType)
    const timestamp = new Date().toISOString()
    
    const filters = {
      dateRange: dateRange.from && dateRange.to ? `${dateRange.from} to ${dateRange.to}` : "All time",
      properties: selectedProperties.length > 0 ? selectedProperties.join(", ") : "All properties",
      glCodes: selectedGLCodes.length > 0 ? selectedGLCodes.join(", ") : "All GL codes",
      expenseStatus: selectedExpenseStatus.length > 0 ? selectedExpenseStatus.join(", ") : "All statuses",
      trustAccount: selectedTrustAccount === "all" ? "All trust accounts" : selectedTrustAccount
    }

    console.log("Generating report:", {
      type: selectedReportType?.name,
      format,
      filters,
      timestamp
    })

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsGenerating(false)
    
    // Mock download
    const fileName = `${reportType}-report-${new Date().toISOString().split('T')[0]}.${format}`
    alert(`Report generated: ${fileName}`)
  }

  const handlePropertyToggle = (property: string) => {
    setSelectedProperties(prev => 
      prev.includes(property) 
        ? prev.filter(p => p !== property)
        : [...prev, property]
    )
  }

  const handleGLCodeToggle = (code: string) => {
    setSelectedGLCodes(prev => 
      prev.includes(code) 
        ? prev.filter(c => c !== code)
        : [...prev, code]
    )
  }

  const handleExpenseStatusToggle = (status: string) => {
    setSelectedExpenseStatus(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    )
  }

  const clearAllFilters = () => {
    setDateRange({ from: "", to: "" })
    setSelectedProperties([])
    setSelectedGLCodes([])
    setSelectedExpenseStatus([])
    setSelectedTrustAccount("all")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Reporting</h2>
        <p className="text-sm text-gray-400">Generate high-fidelity exports for bookkeeping, tax prep, and compliance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filters Panel */}
        <div className="lg:col-span-1">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span>Filters</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                >
                  Clear All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Date Range */}
              <div>
                <Label className="text-gray-300 text-sm font-medium">Date Range</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <Label className="text-gray-400 text-xs">From</Label>
                    <Input
                      type="date"
                      value={dateRange.from}
                      onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-400 text-xs">To</Label>
                    <Input
                      type="date"
                      value={dateRange.to}
                      onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Properties */}
              <div>
                <Label className="text-gray-300 text-sm font-medium">Properties</Label>
                <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                  {propertyOptions.map((property) => (
                    <div key={property} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={property}
                        checked={selectedProperties.includes(property)}
                        onChange={() => handlePropertyToggle(property)}
                        className="rounded bg-gray-700 border-gray-600"
                      />
                      <Label htmlFor={property} className="text-white text-xs cursor-pointer">
                        {property}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* GL Codes */}
              <div>
                <Label className="text-gray-300 text-sm font-medium">GL Codes</Label>
                <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                  {glCodeOptions.map((code) => (
                    <div key={code} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={code}
                        checked={selectedGLCodes.includes(code)}
                        onChange={() => handleGLCodeToggle(code)}
                        className="rounded bg-gray-700 border-gray-600"
                      />
                      <Label htmlFor={code} className="text-white text-xs cursor-pointer">
                        {code}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expense Status */}
              <div>
                <Label className="text-gray-300 text-sm font-medium">Expense Status</Label>
                <div className="mt-2 space-y-2">
                  {expenseStatusOptions.map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={status}
                        checked={selectedExpenseStatus.includes(status)}
                        onChange={() => handleExpenseStatusToggle(status)}
                        className="rounded bg-gray-700 border-gray-600"
                      />
                      <Label htmlFor={status} className="text-white text-xs cursor-pointer">
                        {status}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Account */}
              <div>
                <Label className="text-gray-300 text-sm font-medium">Trust Account (Optional)</Label>
                <Select value={selectedTrustAccount} onValueChange={setSelectedTrustAccount}>
                  <SelectTrigger className="mt-2 bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="All trust accounts" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="all">All trust accounts</SelectItem>
                    {trustAccountOptions.map((account) => (
                      <SelectItem key={account} value={account}>
                        {account}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Types Panel */}
        <div className="lg:col-span-2">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Report Types</CardTitle>
              <p className="text-sm text-gray-400">Select the type of report you want to generate</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {reportTypes.map((report) => (
                <div
                  key={report.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    reportType === report.id
                      ? "border-blue-500 bg-blue-900/20"
                      : "border-gray-600 bg-gray-700 hover:bg-gray-600"
                  }`}
                  onClick={() => setReportType(report.id)}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="radio"
                      id={report.id}
                      name="reportType"
                      checked={reportType === report.id}
                      onChange={() => setReportType(report.id)}
                      className="text-blue-600"
                    />
                    <Label htmlFor={report.id} className="text-white font-medium cursor-pointer">
                      {report.name}
                    </Label>
                  </div>
                  <p className="text-sm text-gray-300 ml-6">{report.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Generate Report Section */}
          <Card className="bg-gray-800 border-gray-700 mt-6">
            <CardHeader>
              <CardTitle className="text-white">Generate Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2">Active Filters Summary</h4>
                  <div className="text-sm text-gray-300 space-y-1">
                    <div>
                      <span className="font-medium">Date Range:</span> {
                        dateRange.from && dateRange.to 
                          ? `${dateRange.from} to ${dateRange.to}`
                          : "All time"
                      }
                    </div>
                    <div>
                      <span className="font-medium">Properties:</span> {
                        selectedProperties.length > 0 
                          ? `${selectedProperties.length} selected`
                          : "All properties"
                      }
                    </div>
                    <div>
                      <span className="font-medium">GL Codes:</span> {
                        selectedGLCodes.length > 0 
                          ? `${selectedGLCodes.length} selected`
                          : "All GL codes"
                      }
                    </div>
                    <div>
                      <span className="font-medium">Expense Status:</span> {
                        selectedExpenseStatus.length > 0 
                          ? `${selectedExpenseStatus.length} selected`
                          : "All statuses"
                      }
                    </div>
                    <div>
                      <span className="font-medium">Trust Account:</span> {
                        selectedTrustAccount === "all" ? "All trust accounts" : selectedTrustAccount
                      }
                    </div>
                  </div>
                </div>

                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                  <h4 className="font-medium text-blue-300 mb-2">Export Options</h4>
                  <div className="text-sm text-blue-200 mb-4">
                    Reports will include:
                    <ul className="mt-2 space-y-1 ml-4">
                      <li>• Generated timestamp</li>
                      <li>• Applied filters summary</li>
                      <li>• Receipt links (where available)</li>
                      <li>• Formatted tables matching expense views</li>
                    </ul>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleGenerateReport('csv')}
                      disabled={isGenerating}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <FileSpreadsheet className="h-4 w-4 mr-2" />
                          Generate CSV
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => handleGenerateReport('pdf')}
                      disabled={isGenerating}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4 mr-2" />
                          Generate PDF
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Reports */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div>
                <div className="text-white font-medium">Trust Account Reconciliation Report</div>
                <div className="text-sm text-gray-400">Generated on: 2024-07-08 14:30:22 • All properties • CSV</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="bg-gray-600 border-gray-500 text-white">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button size="sm" variant="outline" className="bg-gray-600 border-gray-500 text-white">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div>
                <div className="text-white font-medium">Tax Deduction Summary</div>
                <div className="text-sm text-gray-400">Generated on: 2024-07-07 09:15:45 • YTD • PDF</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="bg-gray-600 border-gray-500 text-white">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button size="sm" variant="outline" className="bg-gray-600 border-gray-500 text-white">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div>
                <div className="text-white font-medium">Flagged Expense Report</div>
                <div className="text-sm text-gray-400">Generated on: 2024-07-05 16:22:18 • Q2 2024 • CSV</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="bg-gray-600 border-gray-500 text-white">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button size="sm" variant="outline" className="bg-gray-600 border-gray-500 text-white">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function CollateralTab() {
  const [collateralViewMode, setCollateralViewMode] = useState<'card' | 'list'>('card')
  const [collateralSearchQuery, setCollateralSearchQuery] = useState('')
  const [collateralDebouncedSearchQuery, setCollateralDebouncedSearchQuery] = useState('')
  const [collateralIsSearching, setCollateralIsSearching] = useState(false)
  const [collateralFilterProperty, setCollateralFilterProperty] = useState('all')
  const [collateralFilterDocType, setCollateralFilterDocType] = useState('all')
  const [collateralFilterUploadedBy, setCollateralFilterUploadedBy] = useState('all')
  const [collateralFilterDateFrom, setCollateralFilterDateFrom] = useState('')
  const [collateralFilterDateTo, setCollateralFilterDateTo] = useState('')
  const [collateralUploadDialogOpen, setCollateralUploadDialogOpen] = useState(false)
  const [collateralPreviewDialogOpen, setCollateralPreviewDialogOpen] = useState(false)
  const [askAiModalOpen, setAskAiModalOpen] = useState(false)
  const [collateralSelectedDocs, setCollateralSelectedDocs] = useState<string[]>([])
  const [collateralDocs, setCollateralDocs] = useState<CollateralDocument[]>(collateralDocuments)
  const [selectedCollateralDoc, setSelectedCollateralDoc] = useState<CollateralDocument | null>(null)

  // Debounced search for CollateralHub to prevent UI freezing
  useEffect(() => {
    if (collateralSearchQuery === '') {
      setCollateralDebouncedSearchQuery('')
      setCollateralIsSearching(false)
      return
    }

    setCollateralIsSearching(true)
    const handler = setTimeout(() => {
      setCollateralDebouncedSearchQuery(collateralSearchQuery)
      setCollateralIsSearching(false)
    }, 500)

    return () => {
      clearTimeout(handler)
    }
  }, [collateralSearchQuery])

  // Optimized Collateral Hub Helper Functions with memoization
  const filteredCollateralDocs = useMemo(() => {
    // Show previous results while searching to prevent UI freezing
    if (collateralIsSearching && collateralDebouncedSearchQuery !== '') {
      return collateralDocs
    }
    
    return collateralDocs.filter(doc => {
      const searchQuery = collateralDebouncedSearchQuery
      
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch = (
          doc.filename.toLowerCase().includes(query) ||
          doc.description?.toLowerCase().includes(query) ||
          doc.tags.some(tag => tag.toLowerCase().includes(query)) ||
          doc.linkedVendor?.toLowerCase().includes(query)
        )
        if (!matchesSearch) return false
      }
      
      // Property filter
      if (collateralFilterProperty !== 'all' && doc.propertyId !== collateralFilterProperty) {
        return false
      }
      
      // Document type filter
      if (collateralFilterDocType !== 'all' && doc.documentType !== collateralFilterDocType) {
        return false
      }
      
      // Uploaded by filter
      if (collateralFilterUploadedBy !== 'all' && doc.uploadedBy !== collateralFilterUploadedBy) {
        return false
      }
      
      // Date range filter
      if (collateralFilterDateFrom && new Date(doc.uploadDate) < new Date(collateralFilterDateFrom)) {
        return false
      }
      if (collateralFilterDateTo && new Date(doc.uploadDate) > new Date(collateralFilterDateTo)) {
        return false
      }
      
      return true
    })
  }, [
    collateralDocs,
    collateralDebouncedSearchQuery,
    collateralFilterProperty,
    collateralFilterDocType,
    collateralFilterUploadedBy,
    collateralFilterDateFrom,
    collateralFilterDateTo,
    collateralIsSearching
  ])

  const handleCollateralDocPreview = (doc: CollateralDocument) => {
    setSelectedCollateralDoc(doc)
    setCollateralPreviewDialogOpen(true)
  }

  const handleCollateralExportSelected = () => {
    if (collateralSelectedDocs.length === 0) return
    
    const selectedDocsData = collateralDocs.filter(doc => collateralSelectedDocs.includes(doc.id))
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
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'collateral_documents_export.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getDocumentTypeIcon = (docType: DocumentType) => {
    switch (docType) {
      case 'vendor_contract': return FileText
      case 'warranty': return Award
      case 'insurance_certificate': return FileWarning
      case 'bid_response': return Receipt
      case 'receipt': return Receipt
      case 'invoice': return DollarSign
      case 'communication_log': return MessageSquare
      case 'compliance_doc': return FileWarning
      default: return FileText
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
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

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search documents..."
              value={collateralSearchQuery}
              onChange={(e) => setCollateralSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-600 text-white"
            />
          </div>
        </div>
        
        <Select value={collateralFilterProperty} onValueChange={setCollateralFilterProperty}>
          <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
            <SelectValue placeholder="All Properties" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            <SelectItem value="all">All Properties</SelectItem>
            {propertyOptions.map((property) => (
              <SelectItem key={property.id} value={property.id}>
                {property.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={collateralFilterDocType} onValueChange={setCollateralFilterDocType}>
          <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
            <SelectValue placeholder="Document Type" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            <SelectItem value="all">All Types</SelectItem>
            {Object.entries(documentTypeLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={collateralFilterUploadedBy} onValueChange={setCollateralFilterUploadedBy}>
          <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
            <SelectValue placeholder="Uploaded By" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            <SelectItem value="all">All Uploaders</SelectItem>
            {staffOptions.map((staff) => (
              <SelectItem key={staff.id} value={staff.name}>
                {staff.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCollateralViewMode('card')}
            className={collateralViewMode === 'card' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-800 border-gray-600 text-gray-300'}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCollateralViewMode('list')}
            className={collateralViewMode === 'list' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-800 border-gray-600 text-gray-300'}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Results */}
      {collateralViewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCollateralDocs.map((doc) => {
            const IconComponent = getDocumentTypeIcon(doc.documentType)
            const isSelected = collateralSelectedDocs.includes(doc.id)
            
            return (
              <Card 
                key={doc.id} 
                className={`bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors cursor-pointer ${
                  isSelected ? 'border-blue-500 bg-blue-900/20' : ''
                }`}
                onClick={() => {
                  if (isSelected) {
                    setCollateralSelectedDocs(prev => prev.filter(id => id !== doc.id))
                  } else {
                    setCollateralSelectedDocs(prev => [...prev, doc.id])
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
                  
                  <div className="space-y-2 text-xs text-gray-400">
                    <div className="flex justify-between">
                      <span>Uploaded:</span>
                      <span>{doc.uploadDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>By:</span>
                      <span>{doc.uploadedBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Property:</span>
                      <span>{doc.propertyName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <span>{formatFileSize(doc.fileSize)}</span>
                    </div>
                    {doc.amount && (
                      <div className="flex justify-between">
                        <span>Amount:</span>
                        <span className="text-green-400">${doc.amount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  
                  {doc.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {doc.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} className="bg-gray-700 text-gray-300 text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {doc.tags.length > 3 && (
                        <Badge className="bg-gray-700 text-gray-300 text-xs">
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
                        e.stopPropagation()
                        handleCollateralDocPreview(doc)
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
                        e.stopPropagation()
                        window.open(doc.fileUrl, '_blank')
                      }}
                    >
                      <LinkIcon className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
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
                          setCollateralSelectedDocs(filteredCollateralDocs.map(doc => doc.id))
                        } else {
                          setCollateralSelectedDocs([])
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
                  const IconComponent = getDocumentTypeIcon(doc.documentType)
                  const isSelected = collateralSelectedDocs.includes(doc.id)
                  
                  return (
                    <tr key={doc.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          className="rounded bg-gray-700 border-gray-600"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCollateralSelectedDocs(prev => [...prev, doc.id])
                            } else {
                              setCollateralSelectedDocs(prev => prev.filter(id => id !== doc.id))
                            }
                          }}
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4 text-blue-400" />
                          <div className="min-w-0">
                            <div className="text-white font-medium break-words">{doc.filename}</div>
                            <div className="text-xs text-gray-400">{doc.description || 'No description'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className="bg-gray-700 text-gray-300">
                          {documentTypeLabels[doc.documentType]}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-white">{doc.uploadDate}</td>
                      <td className="py-3 px-4 text-white">{doc.uploadedBy}</td>
                      <td className="py-3 px-4 text-white">{doc.propertyName}</td>
                      <td className="py-3 px-4 text-white">{formatFileSize(doc.fileSize)}</td>
                      <td className="py-3 px-4 text-white">
                        {doc.amount ? (
                          <span className="text-green-400">${doc.amount.toLocaleString()}</span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
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
                  )
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

      {/* Upload Dialog */}
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
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-semibold text-yellow-300">Demo Mode</span>
              </div>
              <p className="text-sm text-yellow-200">
                This is a demonstration of the file upload interface. No files will actually be uploaded in this demo.
              </p>
            </div>

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
          </div>

          <DialogFooter className="mt-6">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => {
                alert('Demo: Files would be uploaded successfully!')
                setCollateralUploadDialogOpen(false)
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

      {/* Ask AI Modal */}
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
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="h-4 w-4 text-purple-400" />
                <span className="text-sm font-semibold text-purple-300">AI Assistant Demo</span>
              </div>
              <p className="text-sm text-purple-200">
                This is a demonstration of the AI assistant for document analysis. In the full version, you could ask questions like "Find all warranties expiring in 2025" or "Show me invoices from Sarah Chen over $5,000".
              </p>
            </div>
          </div>

          <DialogFooter>
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

      {/* Preview Dialog */}
      <Dialog open={collateralPreviewDialogOpen} onOpenChange={setCollateralPreviewDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto m-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-400" />
              Document Preview
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Preview and details for {selectedCollateralDoc?.filename}
            </DialogDescription>
          </DialogHeader>

          {selectedCollateralDoc && (
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Document Type:</span>
                    <span className="text-white ml-2">{documentTypeLabels[selectedCollateralDoc.documentType]}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Upload Date:</span>
                    <span className="text-white ml-2">{selectedCollateralDoc.uploadDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Uploaded By:</span>
                    <span className="text-white ml-2">{selectedCollateralDoc.uploadedBy}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Property:</span>
                    <span className="text-white ml-2">{selectedCollateralDoc.propertyName}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">File Size:</span>
                    <span className="text-white ml-2">{formatFileSize(selectedCollateralDoc.fileSize)}</span>
                  </div>
                  {selectedCollateralDoc.amount && (
                    <div>
                      <span className="text-gray-400">Amount:</span>
                      <span className="text-green-400 ml-2">${selectedCollateralDoc.amount.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Document preview would appear here in the full version</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => selectedCollateralDoc && window.open(selectedCollateralDoc.fileUrl, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Document
            </Button>
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300"
              onClick={() => setCollateralPreviewDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </>
  )
} 