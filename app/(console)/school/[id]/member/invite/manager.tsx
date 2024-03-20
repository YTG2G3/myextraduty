'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import inviteMember from '@/lib/actions/invite-member';
import { School } from '@/prisma/client';
import { RotateCcw, Send, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import HeaderWrapper from '../../header-wrapper';

export default function InviteMember({ school }: { school: School }) {
  const router = useRouter();

  const [input, setInput] = useState('');
  const [emails, setEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState<string[]>([]);
  const [manager, setManager] = useState<string[]>([]);

  const addEmail = (value) => {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!regex.test(value)) {
      toast.error('Email is invalid.');
      return;
    }
    if (emails.includes(value)) {
      toast.error('Email is already added.');
      return;
    }
    setEmails([...emails, value]);
    setInput('');
  };

  const sendInvitation = async () => {
    let failed_count = 0;
    setLoading(true);
    toast.loading('Sending invitation...', { id: 'invite' });

    for (const email of emails) {
      try {
        if (manager.includes(email)) {
          await inviteMember(school.id, email, true);
        } else {
          await inviteMember(school.id, email);
        }
      } catch (e) {
        if (e instanceof Error) {
          toast.error(`Failed to send invitation to ${email}: ${e.message}`);
        } else {
          toast.error(`Failed to send invitation to ${email}.`);
        }
        setFailed((prev) => [...prev, email]);
        failed_count++;
      }
    }
    toast.success(
      `Invitation sent to ${emails.length - failed_count} people.`,
      { id: 'invite' }
    );
    setEmails([]);
    setManager([]);
    setLoading(false);
    router.refresh();
  };

  return (
    <HeaderWrapper title="Invite new member">
      <div className="flex items-center space-x-2">
        <Input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              addEmail(input);
            }
          }}
          placeholder="mingeon.kim@algorix.io"
          disabled={loading}
        />
        <Button
          onClick={() => {
            addEmail(input);
          }}
          disabled={loading}
        >
          Add email
        </Button>
        <span className="text-muted-foreground text-sm px-4">or</span>
        <Button
          variant="outline"
          onClick={() => toast.error('not yet implemented!')}
          disabled={loading}
        >
          Import from CSV
        </Button>
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <Separator />
        {failed.length > 0 && (
          <div className="flex items-center space-x-4">
            <span className="text-sm bg-destructive py-1 px-2 rounded-md text-destructive-foreground">
              There {failed.length === 1 ? 'is' : 'are'} {failed.length} failed
              email address{failed.length === 1 ? '' : 'es'} to invite:{' '}
              {failed.join(', ')}
            </span>
            <Button
              variant="outline"
              onClick={() => {
                const new_failed = failed.filter(
                  (email) => !emails.includes(email)
                );
                setEmails([...emails, ...new_failed]);
                setFailed([]);
              }}
              className="space-x-2 py-1 px-4 text-sm"
              disabled={loading}
            >
              <RotateCcw size={15} />
              <span>Add again</span>
            </Button>
          </div>
        )}
        <div className="flex space-x-4 items-center">
          <span className="font-medium text-xl font-grotesque">
            Added emails ({emails.length} emails)
          </span>
          <Button
            className="space-x-2"
            disabled={emails.length === 0 || loading}
            onClick={sendInvitation}
          >
            <Send />
            <span>Send invitation</span>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="space-x-2"
                disabled={emails.length === 0 || loading}
              >
                <Trash />
                <span>Clear All</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => setEmails([])}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        {emails.map((email, index) => (
          <div key={email} className="flex items-center space-x-4">
            <Input value={email} disabled />
            <Select
              value={manager.includes(email) ? 'manager' : 'student'}
              onValueChange={(e) => {
                if (e === 'manager') {
                  if (!manager.includes(email)) {
                    setManager([...manager, email]);
                  }
                } else {
                  setManager(manager.filter((m) => m !== email));
                }
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => {
                setEmails(emails.filter((_, i) => i !== index));
              }}
              className="space-x-2"
              disabled={loading}
            >
              <Trash />
              <span>Remove user</span>
            </Button>
          </div>
        ))}
      </div>
      <div></div>
    </HeaderWrapper>
  );
}

// function InviteDialog() {
//   const [email, setEmail] = useState('');
//   const [disabled, setDisabled] = useState(false);

//   const handleInvite = async () => {
//     setDisabled(true);
//     toast.loading('Inviting user...', { id: 'invite' });
//     const emailregex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
//     if (!emailregex.test(email)) {
//       toast.error('Email is invalid.', { id: 'invite' });
//       setDisabled(false);
//       return;
//     }
//     try {
//       await inviteMember(SchoolState.getState().school.id, email);
//       toast.success('User invited.', { id: 'invite' });
//     } catch (e) {
//       if (e instanceof Error) toast.error(e.message);
//       else toast.error('Failed to invite user.', { id: 'invite' });
//     } finally {
//       setDisabled(false);
//     }
//   };

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="outline" className="flex flex-row gap-2">
//           <SendHorizonal /> Invite
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>Invite member</DialogTitle>
//           <DialogDescription>
//             Put in the email address of the person you want to invite.
//           </DialogDescription>
//         </DialogHeader>
//         <div className="flex items-center space-x-2">
//           <div className="grid flex-1 gap-2">
//             <Label htmlFor="link" className="sr-only">
//               Email
//             </Label>
//             <Input
//               value={email}
//               id="email"
//               placeholder="mingeon.kim@algorix.io"
//               onChange={(e) => {
//                 setEmail(e.target.value);
//               }}
//               disabled={disabled}
//             />
//           </div>
//         </div>
//         <DialogFooter className="sm:justify-start">
//           <div className="w-full flex flex-col items-end">
//             <div>
//               <DialogClose asChild>
//                 <Button variant="outline" className="mr-2" disabled={disabled}>
//                   Cancel
//                 </Button>
//               </DialogClose>
//               <Button
//                 onClick={() => handleInvite()}
//                 className="mt-2"
//                 disabled={disabled}
//               >
//                 Invite
//               </Button>
//             </div>
//           </div>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
