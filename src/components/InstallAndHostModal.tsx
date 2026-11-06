import React, { useState } from 'react';
import {
  Smartphone,
  Github,
  Share2,
  PlusSquare,
  Check,
  Copy,
  ExternalLink,
  QrCode,
  ShieldCheck,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface InstallAndHostModalProps {
  isOpen: boolean;
  onClose: () => void;
  appUrl: string;
}

export const InstallAndHostModal: React.FC<InstallAndHostModalProps> = ({
  isOpen,
  onClose,
  appUrl
}) => {
  const [activeTab, setActiveTab] = useState<'iphone_install' | 'github_hosting'>('iphone_install');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedGitCommand, setCopiedGitCommand] = useState(false);

  if (!isOpen) return null;

  const currentUrl = appUrl || window.location.href;

  const handleCopyUrl = () => {
    navigator.clipboard?.writeText(currentUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const gitPushScript = `git init
git add .
git commit -m "Initial Aperture Pro & Heritage Camera"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/aperture-pro.git
git push -u origin main`;

  const handleCopyGit = () => {
    navigator.clipboard?.writeText(gitPushScript);
    setCopiedGitCommand(true);
    setTimeout(() => setCopiedGitCommand(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">Install on iPhone & Host from GitHub</h2>
              <p className="text-[11px] text-neutral-400">Run fullscreen like a native iOS camera app</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* Segmented Mode Tabs */}
        <div className="flex p-2 bg-neutral-950 border-b border-neutral-800 shrink-0">
          <button
            onClick={() => setActiveTab('iphone_install')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'iphone_install'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4 text-sky-400" />
            <span>Install on iPhone (PWA)</span>
          </button>

          <button
            onClick={() => setActiveTab('github_hosting')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'github_hosting'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Github className="w-4 h-4 text-amber-400" />
            <span>Host from GitHub Pages</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs text-neutral-300 leading-relaxed">
          {activeTab === 'iphone_install' ? (
            <>
              {/* Live Status Callout */}
              <div className="p-3.5 rounded-xl bg-sky-950/40 border border-sky-800/60 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white text-xs">
                    Yes! You can install and use it directly on your iPhone right now.
                  </div>
                  <p className="text-[11px] text-sky-200/80 mt-0.5">
                    It operates as an Apple Progressive Web App (PWA). It launches in <strong>standalone fullscreen</strong> without Safari address bars and has direct hardware access to your iPhone 15 Pro Max cameras and sensors.
                  </p>
                </div>
              </div>

              {/* Direct App URL Box */}
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider mb-1.5">
                  Your Live Camera Web App URL
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={currentUrl}
                    className="flex-1 bg-neutral-900 border border-neutral-700/80 rounded-lg px-3 py-2 text-xs font-mono text-neutral-200 truncate select-all"
                  />
                  <button
                    onClick={handleCopyUrl}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-colors shrink-0 cursor-pointer"
                  >
                    {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUrl ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>

              {/* Step by step iPhone instructions with visual icons */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold text-white uppercase tracking-wider">
                  How to Install on iPhone (Safari):
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-950/50 border border-neutral-800/80">
                    <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center font-bold font-mono text-white text-xs shrink-0">
                      1
                    </div>
                    <div>
                      <div className="font-semibold text-white">Open in Safari</div>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Open the link above in <strong>Safari</strong> on your iPhone 15 Pro Max (Chrome/Firefox on iOS also support this).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-950/50 border border-neutral-800/80">
                    <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center font-bold font-mono text-white text-xs shrink-0">
                      2
                    </div>
                    <div>
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        <span>Tap the Share Button</span>
                        <Share2 className="w-3.5 h-3.5 text-sky-400" />
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Tap the blue square icon with the up-arrow at the bottom of your Safari screen.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-950/50 border border-neutral-800/80">
                    <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center font-bold font-mono text-white text-xs shrink-0">
                      3
                    </div>
                    <div>
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        <span>Select "Add to Home Screen"</span>
                        <PlusSquare className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Scroll down the share sheet and tap <strong>"Add to Home Screen"</strong> with the plus sign icon.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-950/50 border border-neutral-800/80">
                    <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center font-bold font-mono text-white text-xs shrink-0">
                      4
                    </div>
                    <div>
                      <div className="font-semibold text-white">Tap "Add" & Shoot!</div>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Confirm <strong>Add</strong> in the top right. Aperture Pro will now appear right on your iPhone Home Screen with its custom lens icon!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* GitHub Hosting Guide */}
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
                <div className="font-semibold text-white text-xs flex items-center gap-2">
                  <Github className="w-4 h-4 text-white" />
                  <span>Host from your own GitHub Repository</span>
                </div>
                <p className="text-[11px] text-neutral-400 mt-1">
                  You can deploy this application directly to <strong>GitHub Pages</strong> or <strong>Vercel / Cloudflare Pages</strong> for free in under 2 minutes.
                </p>
              </div>

              {/* Option A: 1-Click Vercel / Cloudflare */}
              <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-1.5">
                <div className="text-xs font-bold text-white">Option 1: 1-Click Zero-Config Hosting (Vercel / Netlify)</div>
                <p className="text-[11px] text-neutral-400">
                  Import your GitHub repository into <strong className="text-white">Vercel</strong> or <strong className="text-white">Cloudflare Pages</strong>. It detects Vite automatically, runs <code className="text-sky-300">npm run build</code>, and provides you with an HTTPS URL that automatically supports camera permissions and PWA installation on iOS!
                </p>
              </div>

              {/* Option B: GitHub Actions for GitHub Pages */}
              <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-2">
                <div className="text-xs font-bold text-white">Option 2: Push to GitHub & Deploy GitHub Pages</div>
                <p className="text-[11px] text-neutral-400">
                  Run these commands in your terminal to initialize and push your repository:
                </p>

                <div className="relative">
                  <pre className="p-3 rounded-lg bg-black text-[11px] font-mono text-amber-300 overflow-x-auto border border-neutral-800">
                    {gitPushScript}
                  </pre>
                  <button
                    onClick={handleCopyGit}
                    className="absolute top-2 right-2 p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[10px] flex items-center gap-1 cursor-pointer"
                  >
                    {copiedGitCommand ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedGitCommand ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="text-[11px] text-neutral-400 space-y-1 pt-1">
                  <div>1. Go to your repository settings on <strong>github.com</strong>.</div>
                  <div>2. Navigate to <strong>Pages</strong> (under Code and automation).</div>
                  <div>3. Set <strong>Source</strong> to <em>GitHub Actions</em> (or build from <em>dist/</em> branch).</div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-neutral-800 bg-neutral-950/80 shrink-0">
          <div className="text-[11px] text-neutral-500">
            Aperture Pro · Standalone PWA Architecture
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
