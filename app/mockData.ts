// Mock data for jobs
export const jobsList = [
  {
    id: 'job1',
    property: 'Stanford GSB',
    owner: 'John Smith',
    priority: 'High',
    status: 'Pending',
    statusValue: 'pending',
    description: 'HVAC System Maintenance - Annual Service',
    requested: '2024-01-20',
    notes: 'Annual service required by vendor contract.',
    technician: 'Alice Johnson',
    techStatus: 'Not Started',
    preApprovalStatus: 'Required',
    cost: 2500,
  },
  {
    id: 'job2',
    property: 'Sunnyvale 432',
    owner: 'Mike Chen',
    priority: 'Medium',
    status: 'Approved',
    statusValue: 'approved',
    description: 'Emergency Plumbing Repair - Kitchen Sink',
    requested: '2024-01-18',
    notes: 'Owner approved after urgent call.',
    technician: 'Alice Johnson',
    techStatus: 'In Progress',
    preApprovalStatus: 'Not Required',
    cost: 850,
  },
  {
    id: 'job3',
    property: 'Downtown Lofts',
    owner: 'Alex Rodriguez',
    priority: 'Low',
    status: 'Rejected',
    statusValue: 'rejected',
    description: 'Lobby Painting',
    requested: '2024-01-10',
    notes: 'Budget not available this quarter.',
    technician: 'Alice Johnson',
    techStatus: 'Finished',
    preApprovalStatus: 'Required',
    cost: 500,
  },
  {
    id: 'job4',
    property: 'Stanford GSB',
    owner: 'John Smith',
    priority: 'Medium',
    status: 'Approved',
    statusValue: 'approved',
    description: 'Kitchen Renovation - Countertop Replacement',
    requested: '2024-01-15',
    notes: 'Replace outdated kitchen countertops with quartz.',
    technician: 'Alice Johnson',
    techStatus: 'In Progress',
    preApprovalStatus: 'Required',
    cost: 5000,
  },
  {
    id: 'job5',
    property: 'Sunnyvale 432',
    owner: 'Mike Chen',
    priority: 'High',
    status: 'Approved',
    statusValue: 'approved',
    description: 'Electrical Panel Upgrade',
    requested: '2024-01-12',
    notes: 'Upgrade electrical panel to meet current code requirements.',
    technician: 'Bob Wilson',
    techStatus: 'Not Started',
    preApprovalStatus: 'Required',
    cost: 3500,
  }
];

// Mock data for activity milestones
export const activityMilestones = [
  {
    milestone: 'Work Order Received',
    owner: 'PM',
    description: 'Initial request received from owner',
    responsibility: 'Property Manager receives and logs the work order'
  },
  {
    milestone: 'Pre-Approval Sent',
    owner: 'PM',
    description: 'Approval request sent to owner',
    responsibility: 'Property Manager sends approval request to owner'
  },
  {
    milestone: 'Pre-Approval Received',
    owner: 'PM',
    description: 'Owner approval received',
    responsibility: 'Property Manager receives and processes owner approval'
  },
  {
    milestone: 'Assigned to Technician',
    owner: 'Central Office',
    description: 'Job assigned to technician',
    responsibility: 'Central Office assigns appropriate technician based on skills and availability'
  },
  {
    milestone: 'Work Started',
    owner: 'Technician',
    description: 'Technician begins work',
    responsibility: 'Technician starts the assigned work'
  },
  {
    milestone: 'Work Completed',
    owner: 'Technician',
    description: 'Technician completes work',
    responsibility: 'Technician completes and reports work done'
  },
  {
    milestone: 'Work Verified',
    owner: 'PM',
    description: 'PM verifies completed work',
    responsibility: 'Property Manager verifies work quality and completion'
  },
  {
    milestone: 'Other',
    owner: 'PM',
    description: 'Other or custom milestone',
    responsibility: 'Track any other activity or note'
  }
];

// Mock job notes (empty for now)
export const jobNotes: { [jobId: string]: { author: string, content: string, timestamp: string }[] } = {};

// Mock activity files (empty for now)
export const activityFiles: { [key: string]: File[] } = {};

// Mock RFP/Bid data
export type RFPBid = {
  id: string;
  jobId: string;
  vendorName: string;
  vendorContact: string;
  vendorEmail: string;
  vendorPhone: string;
  bidAmount: number;
  submittedDate: string;
  estimatedDuration: string;
  scope: string;
  materials: string;
  labor: string;
  pmComments: string;
  status: 'submitted' | 'under_review' | 'selected' | 'rejected';
  attachments: string[];
  warranty: string;
  startDate: string;
  completionDate: string;
};

export const rfpBids: { [jobId: string]: RFPBid[] } = {
  'job1': [
    {
      id: 'bid1',
      jobId: 'job1',
      vendorName: 'HVAC Pro Services',
      vendorContact: 'John Martinez',
      vendorEmail: 'john@hvacpro.com',
      vendorPhone: '(555) 123-4567',
      bidAmount: 2200,
      submittedDate: '2024-01-22',
      estimatedDuration: '2 days',
      scope: 'Complete HVAC system maintenance including filter replacement, duct cleaning, and system diagnostics',
      materials: 'New filters, cleaning supplies, replacement parts as needed',
      labor: '16 hours - 2 technicians for 2 days',
      pmComments: 'Good reputation, competitive price. Need to verify insurance.',
      status: 'under_review',
      attachments: ['hvac_maintenance_plan.pdf', 'insurance_cert.pdf'],
      warranty: '1 year on parts, 6 months on labor',
      startDate: '2024-02-01',
      completionDate: '2024-02-03'
    },
    {
      id: 'bid2',
      jobId: 'job1',
      vendorName: 'Climate Control Experts',
      vendorContact: 'Sarah Williams',
      vendorEmail: 'sarah@climateexperts.com',
      vendorPhone: '(555) 987-6543',
      bidAmount: 2800,
      submittedDate: '2024-01-23',
      estimatedDuration: '1.5 days',
      scope: 'Comprehensive HVAC maintenance with energy efficiency assessment',
      materials: 'Premium filters, eco-friendly cleaning agents, energy monitoring equipment',
      labor: '12 hours - 2 certified technicians',
      pmComments: 'Higher price but includes energy assessment. Premium service provider.',
      status: 'submitted',
      attachments: ['detailed_proposal.pdf', 'energy_assessment_sample.pdf'],
      warranty: '2 years on parts, 1 year on labor',
      startDate: '2024-01-28',
      completionDate: '2024-01-30'
    },
    {
      id: 'bid3',
      jobId: 'job1',
      vendorName: 'Budget HVAC Solutions',
      vendorContact: 'Mike Thompson',
      vendorEmail: 'mike@budgethvac.com',
      vendorPhone: '(555) 456-7890',
      bidAmount: 1800,
      submittedDate: '2024-01-21',
      estimatedDuration: '3 days',
      scope: 'Basic HVAC maintenance and cleaning',
      materials: 'Standard filters, basic cleaning supplies',
      labor: '24 hours - 1 technician for 3 days',
      pmComments: 'Lowest bid but longer timeline. Need to check references.',
      status: 'rejected',
      attachments: ['basic_proposal.pdf'],
      warranty: '90 days on parts and labor',
      startDate: '2024-02-05',
      completionDate: '2024-02-08'
    }
  ],
  'job4': [
    {
      id: 'bid4',
      jobId: 'job4',
      vendorName: 'Premium Countertops Inc',
      vendorContact: 'Lisa Chen',
      vendorEmail: 'lisa@premiumcountertops.com',
      vendorPhone: '(555) 234-5678',
      bidAmount: 4800,
      submittedDate: '2024-01-16',
      estimatedDuration: '3 days',
      scope: 'Remove existing countertops, install new quartz countertops with undermount sink',
      materials: 'Premium quartz slabs, undermount sink, new faucet, installation hardware',
      labor: '24 hours - 2 experienced installers',
      pmComments: 'Excellent portfolio, includes sink upgrade. Slightly over budget.',
      status: 'selected',
      attachments: ['countertop_samples.pdf', 'installation_timeline.pdf'],
      warranty: '10 years on quartz, 2 years on installation',
      startDate: '2024-02-10',
      completionDate: '2024-02-13'
    },
    {
      id: 'bid5',
      jobId: 'job4',
      vendorName: 'Kitchen Renovations Plus',
      vendorContact: 'David Rodriguez',
      vendorEmail: 'david@kitchenreno.com',
      vendorPhone: '(555) 345-6789',
      bidAmount: 5200,
      submittedDate: '2024-01-17',
      estimatedDuration: '2 days',
      scope: 'Complete countertop replacement with premium quartz and backsplash update',
      materials: 'Premium quartz, new backsplash tiles, upgraded fixtures',
      labor: '16 hours - 3 skilled craftsmen',
      pmComments: 'Includes backsplash which is nice but pushes over budget significantly.',
      status: 'under_review',
      attachments: ['full_kitchen_proposal.pdf', 'backsplash_options.pdf'],
      warranty: '15 years on materials, 5 years on installation',
      startDate: '2024-02-15',
      completionDate: '2024-02-17'
    }
  ]
}; 