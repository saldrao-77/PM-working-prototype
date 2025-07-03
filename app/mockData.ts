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