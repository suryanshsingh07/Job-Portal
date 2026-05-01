import React, { useState } from 'react';
import { CheckCircle, Sparkles, XCircle, Loader2, Clock, RotateCcw, StarOff, Eye } from 'lucide-react';

const ActionBtn = ({ onClick, disabled, loading, icon: Icon, label, color }) => (
  <button onClick={onClick}
    disabled={disabled}
    className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 border active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${color}`}>
    {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Icon className="h-3.5 w-3.5" />}
    <span className="hidden xs:inline sm:inline">{label}</span>
  </button>
);

const ApplicationActions = ({applicationId, status, onApprove, onShortlist, onReject, onInReview, onReset}) => {
  const [loadingAction, setLoadingAction] = useState(null);
  const handleAction = async (actionType, callback) => {
    setLoadingAction(actionType);
    try {
      await callback(applicationId);
    } catch (error) {
      console.error(`Error performing ${actionType}:`, error);
    } finally {
      setLoadingAction(null);
    }
  };

  const s = (status || 'pending').toLowerCase();
  const isAccepted = s === 'accepted';
  const isRejected = s === 'rejected';
  const isShortlisted = s === 'shortlisted';
  const isInReview = s === 'in review';
  const busy = !!loadingAction;

  return (
    <div className="w-full space-y-2">
      {/* Status indicator */}
      <div className="flex items-center gap-1.5">
        <span className={`h-2 w-2 rounded-full shrink-0 ${
          isAccepted ? 'bg-emerald-500' :
          isRejected ? 'bg-rose-500' :
          isShortlisted ? 'bg-blue-500' :
          isInReview ? 'bg-amber-500' :
          'bg-gray-400'}`} />
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          {isAccepted ? 'Accepted' : isRejected ? 'Rejected' : isShortlisted ? 'Shortlisted' : isInReview ? 'In Review' : 'Pending'}
        </span>
      </div>

      {/* Action buttons — responsive grid */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1.5">
        {!isInReview && (
          <ActionBtn onClick={() => handleAction('in_review', onInReview)}
            disabled={busy}
            loading={loadingAction === 'in_review'}
            icon={Eye}
            label="Review"
            color="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-600 hover:text-white hover:border-amber-600"/>
        )}

        {!isShortlisted && !isAccepted && !isRejected && (
          <ActionBtn onClick={() => handleAction('shortlist', onShortlist)}
            disabled={busy}
            loading={loadingAction === 'shortlist'}
            icon={Sparkles}
            label="Shortlist"
            color="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-600 hover:text-white hover:border-blue-600"/>
        )}

        {isShortlisted && (
          <ActionBtn onClick={() => handleAction('reset', onReset)}
            disabled={busy}
            loading={loadingAction === 'reset'}
            icon={StarOff}
            label="Unshortlist"
            color="bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-600 hover:text-white hover:border-gray-600"/>
        )}

        {!isAccepted && (
          <ActionBtn onClick={() => handleAction('approve', onApprove)}
            disabled={busy}
            loading={loadingAction === 'approve'}
            icon={CheckCircle}
            label="Approve"
            color="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600"/>
        )}

        {!isRejected && (
          <ActionBtn onClick={() => handleAction('reject', onReject)}
            disabled={busy}
            loading={loadingAction === 'reject'}
            icon={XCircle}
            label="Reject"
            color="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-600 hover:text-white hover:border-rose-600"/>
        )}

        {(isAccepted || isRejected) && (
          <ActionBtn onClick={() => handleAction('reset', onReset)}
            disabled={busy}
            loading={loadingAction === 'reset'}
            icon={RotateCcw}
            label="Reset"
            color="bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-600 hover:text-white hover:border-gray-600"/>
        )}
      </div>
    </div>
  );
};

export default ApplicationActions;
