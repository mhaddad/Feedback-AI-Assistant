import { FeedbackModelType, FeedbackModelDef } from './types';
import { RefreshCw, Search, Star, HeartHandshake } from 'lucide-react';

export const FEEDBACK_MODELS: FeedbackModelDef[] = [
  {
    type: FeedbackModelType.SBI,
    title: 'SBI Model',
    description: 'Focus on the Situation, Behavior, and Impact of an action.',
    iconName: 'refresh-cw',
    fields: [
      {
        id: 'situation',
        label: 'Situation',
        placeholder: 'e.g., During the weekly project sync on Tuesday morning...',
        description: 'Describe the specific context, time, and place.'
      },
      {
        id: 'behavior',
        label: 'Behavior',
        placeholder: 'e.g., You presented the marketing slides and interrupted the design lead twice...',
        description: 'Describe the observable actions and behaviors. Be objective.'
      },
      {
        id: 'impact',
        label: 'Impact',
        placeholder: 'e.g., This caused the meeting to lose focus and we couldn\'t finalize the timeline...',
        description: 'Explain the effect of the behavior on you, the team, or the project.'
      },
      {
        id: 'recommendation',
        label: 'Recommendation',
        placeholder: 'e.g., In future meetings, I suggest we allow each person to finish their update...',
        description: 'Suggest a desired future action or alternative behavior.',
        isOptional: true
      }
    ]
  },
  {
    type: FeedbackModelType.PPP,
    title: '3P Model',
    description: 'Describe the Position, Problem, and Possibility for improvement.',
    iconName: 'search',
    fields: [
      {
        id: 'positive',
        label: 'Positive (Position)',
        placeholder: 'e.g., Your code quality has significantly improved this sprint...',
        description: 'Acknowledge what is working well.'
      },
      {
        id: 'problem',
        label: 'Problem',
        placeholder: 'e.g., However, the ticket updates in Jira are often delayed...',
        description: 'Describe the specific issue clearly.'
      },
      {
        id: 'possibility',
        label: 'Possibility',
        placeholder: 'e.g., If we update tickets daily, the PM can track progress more accurately.',
        description: 'Describe the potential positive outcome of changing the behavior.'
      }
    ]
  },
  {
    type: FeedbackModelType.STAR,
    title: 'STAR Model',
    description: 'Structure feedback around Situation, Task, Action, and Result.',
    iconName: 'star',
    fields: [
      {
        id: 'situation_task',
        label: 'Situation / Task',
        placeholder: 'e.g., We needed to deliver the Q3 report by Friday...',
        description: 'The context or goal you were working towards.'
      },
      {
        id: 'action',
        label: 'Action',
        placeholder: 'e.g., You stayed late to consolidate data from three different teams...',
        description: 'What the person specifically did.'
      },
      {
        id: 'result',
        label: 'Result',
        placeholder: 'e.g., The report was delivered on time and the client was impressed.',
        description: 'The outcome of their actions.'
      },
      {
        id: 'suggestion',
        label: 'Suggestion',
        placeholder: 'e.g., Maybe automate the data pull next time to save effort.',
        description: 'Optional advice for future tasks.',
        isOptional: true
      }
    ]
  },
  {
    type: FeedbackModelType.CNV,
    title: 'CNV Model',
    description: 'Communicate based on Compassionate Non-Violent principles.',
    iconName: 'heart-handshake',
    fields: [
      {
        id: 'observation',
        label: 'Observation',
        placeholder: 'e.g., When I saw the email sent to the client without internal review...',
        description: 'Objective facts without judgment.'
      },
      {
        id: 'feeling',
        label: 'Feeling',
        placeholder: 'e.g., I felt anxious and concerned...',
        description: 'How this observation made you feel.'
      },
      {
        id: 'need',
        label: 'Need',
        placeholder: 'e.g., because I have a need for accuracy and professional reputation.',
        description: 'The value or desire that caused the feeling.'
      },
      {
        id: 'request',
        label: 'Request',
        placeholder: 'e.g., Would you be willing to send drafts for review 2 hours before the deadline?',
        description: 'A concrete, doable request.'
      }
    ]
  }
];
