/// <reference types="next" />
/// <reference types="next/image-types/global" />

// TypeScript module declarations
declare module '*.tsx' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: React.ComponentType<any>
  export default content
}

declare module '*/applied-content' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const AppliedContent: React.ComponentType<any>
  export default AppliedContent
}

declare module '*/profile-content' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ProfileContent: React.ComponentType<any>
  export default ProfileContent
}

declare module '*/scholarships-content' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ScholarshipsContent: React.ComponentType<any>
  export default ScholarshipsContent
}

declare module '*/dashboard-content' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const DashboardContent: React.ComponentType<any>
  export default DashboardContent
}
