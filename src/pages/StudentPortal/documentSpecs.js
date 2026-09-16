export const DOCUMENT_SPECS = [
  {
    id: 'admissionSlip',
    name: 'Admission Slip',
    required: true,
    desc: 'Official institutional admission slip or fee receipt for the current academic session.',
    accept: '.pdf,.jpg,.jpeg,.png',
  },
  {
    id: 'aadhaarCard',
    name: 'Aadhaar Card',
    required: true,
    desc: 'Government of India Aadhaar identity document (front & back in a single file or scan).',
    accept: '.pdf,.jpg,.jpeg,.png',
  },
  {
    id: 'latestResult',
    name: 'Latest Result / Marksheet',
    required: true,
    desc: 'Most recent semester or examination marksheet issued by your university or board.',
    accept: '.pdf,.jpg,.jpeg,.png',
  },
  {
    id: 'collegeIdCard',
    name: 'College ID Card',
    required: false,
    desc: 'Valid college student photo identity card with current academic year validity (optional if awaiting issuance).',
    accept: '.pdf,.jpg,.jpeg,.png',
  },
]
