import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, Volume2, Paperclip } from 'lucide-react';
import TypewriterContent from '@/components/assistant/TypewriterContent';
import { NEXA_PORTRAIT } from '@/data/nexaPortrait';
import { nexaUrlTransform } from '@/lib/nexaLinks';
import { cn } from '@/lib/utils';

const markdownStyles =
  'space-y-2 text-sm leading-relaxed [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_h1]:text-base [&_h1]:font-bold [&_h2]:text-sm [&_h2]:font-bold [&_h3]:text-sm [&_h3]:font-semibold [&_li]:ml-4 [&_li]:list-disc [&_ol_li]:list-decimal [&_p]:leading-relaxed [&_strong]:font-semibold';

export default function ChatMessage({ message, index, feedback, onFeedback, onSpeak, typing = false, onTypingDone, onTypingTick }) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] space-y-1">
          <div className="rounded-2xl rounded-tr-sm bg-primary px-3 py-2 text-sm leading-relaxed text-primary-foreground">
            {message.content}
          </div>
          {message.attachmentName && (
            <p className="flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
              <Paperclip className="h-3 w-3" /> {message.attachmentName}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2.5">
      <img src={NEXA_PORTRAIT} alt="Nexa" className="h-8 w-8 flex-shrink-0 rounded-full object-cover" />
      <div className="min-w-0 max-w-[85%] space-y-1.5">
        <div className="rounded-2xl rounded-tl-sm bg-secondary px-3 py-2 text-secondary-foreground">
          {typing ? (
            <TypewriterContent
              content={message.content}
              className={markdownStyles}
              speed={14}
              charsPerTick={3}
              onDone={onTypingDone}
              onTick={onTypingTick}
            />
          ) : (
            <div className={markdownStyles}>
              <ReactMarkdown
                urlTransform={nexaUrlTransform}
                components={{
                  a: ({ node, href, children, ...props }) => {
                    const internal = typeof href === 'string' && href.startsWith('/') && !href.startsWith('//');
                    if (internal) {
                      return <Link to={href} {...props}>{children}</Link>;
                    }
                    const dial = /^(tel:|sms:|mailto:)/i.test(String(href || ''));
                    return (
                      <a
                        href={href}
                        {...(dial ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                        {...props}
                      >
                        {children}
                      </a>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
        <div className={cn('flex items-center gap-1', typing && 'hidden')}>
          <button
            onClick={() => onFeedback(index, 'up')}
            aria-label="Helpful answer"
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-secondary',
              feedback === 'up' ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <ThumbsUp className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onFeedback(index, 'down')}
            aria-label="Unhelpful answer"
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-secondary',
              feedback === 'down' ? 'text-destructive' : 'text-muted-foreground'
            )}
          >
            <ThumbsDown className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onSpeak(message.content)}
            aria-label="Read this answer aloud"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Volume2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}