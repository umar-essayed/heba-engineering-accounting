export type ServiceCategory = 
  | 'reconciliation' 
  | 'building_permits' 
  | 'commercial_licenses' 
  | 'land_regularization' 
  | 'drawings_survey' 
  | 'syndicate_reports' 
  | 'district_supervision';

export interface ServiceItem {
  id: string;
  indexCode: string; // e.g., '01', '02'
  title: string;
  category: ServiceCategory;
  shortDesc: string;
  fullDesc: string;
  legalCode: string; // e.g., 'قانون 187 لسنة 2023', 'قانون 154 المحال'
  badge: string;
  iconName: string;
  requiredDocs: string[];
  deliverables: string[];
  durationEstimate: string;
}

export type CaseStatus = 
  | 'docs_received'      // 1. استلام المستندات والفحص المبدئي
  | 'surveying'          // 2. الرفع المساحي والمعاينة الميدانية
  | 'drawings_prep'      // 3. إعداد الرسومات والتقارير الهندسية
  | 'submitted_gov'      // 4. التقديم بالحي والإدارة الهندسية
  | 'committee_review'   // 5. لجان البت والمعاينات الحكومية
  | 'approved_issued';   // 6. صدور النموذج / الترخيص النهائي

export interface CaseDocument {
  id: string;
  title: string;
  type: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  fileUrl?: string; // Cloudflare R2 URL or local preview
  notes?: string;   // ملاحظات على المستند
}

export interface CaseFile {
  id: string;
  code: string; // e.g., 'HB-2026-0108'
  source?: 'website' | 'manual'; // مصدر الطلب: طلب أونلاين من الموقع أم يدوي من المكتب
  clientName: string;
  clientPhone: string;
  nationalId?: string;
  category: ServiceCategory;
  serviceTitle: string;
  propertyAddress: string;
  district: string; // e.g., 'حي العامرية أول', 'حي العجمي'
  status: CaseStatus;
  statusNotes: string;
  createdAt: string;
  lastUpdated: string;
  nextHearingDate?: string;
  
  // Financials
  officeFees?: number; // إذا كان 0 أو غير محدد يظهر كـ "غير محدد"
  paidAmount: number;
  govFees: number; // الرسوم الحكومية المستقلة
  isFullyPaid: boolean;

  documents: CaseDocument[];
}

export interface Receipt {
  id: string;
  receiptNumber: string; // e.g., 'REC-2026-084'
  caseId?: string;       // معرف المعاملة المرتبطة بها
  caseCode: string;      // كود المعاملة
  clientName: string;
  clientPhone: string;
  amount: number;
  amountInWords: string;
  date: string;
  paymentMethod: 'كاش' | 'تحويل بنكي' | 'إنستاباي / فودافون كاش';
  category: string;
  receivedBy: string;
  notes?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  location: string;
  badge: string;
  outcome: string;
  year: string;
  image?: string;
  documents?: CaseDocument[];
}

export interface CloudflareR2Config {
  accountId: string;
  bucketName: string;
  accessKeyId: string;
  secretAccessKey: string;
  publicUrl: string;
  enabled: boolean;
}
