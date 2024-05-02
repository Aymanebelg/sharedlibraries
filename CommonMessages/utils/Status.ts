export const talentStatus = {
    REGISTERED: 'REGISTERED',
    VERIFIED: 'VERIFIED',
    TRAINING_IN_PROGRESS: 'TRAINING_IN_PROGRESS',
    TRAINING_COMPLETED: 'TRAINING_COMPLETED',
    INTERVIEW_SCHEDULED: 'INTERVIEW_SCHEDULED',
    HIRED: 'HIRED',
    PREVIOUSLY_HIRED: 'PREVIOUSLY_HIRED'
  }
  
  type Mapping = Record<string, string>
  
  export const nextStatus: Mapping = {
    REGISTERED: talentStatus.VERIFIED,
    VERIFIED: talentStatus.TRAINING_IN_PROGRESS,
    TRAINING_IN_PROGRESS: talentStatus.TRAINING_COMPLETED,
    TRAINING_COMPLETED: talentStatus.INTERVIEW_SCHEDULED,
    INTERVIEW_SCHEDULED: talentStatus.HIRED,
    HIRED: talentStatus.PREVIOUSLY_HIRED,
    PREVIOUSLY_HIRED: talentStatus.INTERVIEW_SCHEDULED
  }
  
  export const statusList = [
    talentStatus.HIRED,
    talentStatus.INTERVIEW_SCHEDULED,
    talentStatus.PREVIOUSLY_HIRED,
    talentStatus.REGISTERED,
    talentStatus.TRAINING_COMPLETED,
    talentStatus.TRAINING_IN_PROGRESS,
    talentStatus.VERIFIED
  ]
  