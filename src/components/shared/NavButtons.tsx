import React from 'react';

interface NavButtonsProps {
  onBack?: () => void;
  onNext?: () => void;
  backLabel?: string;
  nextLabel?: string;
  isNextDisabled?: boolean;
  isBackDisabled?: boolean;
}

const NavButtons: React.FC<NavButtonsProps> = ({ 
  onBack, 
  onNext, 
  backLabel = "Anterior", 
  nextLabel = "Siguiente",
  isNextDisabled = false,
  isBackDisabled = false
}) => {
  return (
    <div className="mt-8 flex justify-between">
      {onBack ? (
        <button
          onClick={onBack}
          disabled={isBackDisabled}
          className="px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold rounded-lg shadow-md transition duration-150 ease-in-out disabled:opacity-50 text-lg"
        >
          {backLabel}
        </button>
      ) : <div />} 
      {onNext && (
        <button
          onClick={onNext}
          disabled={isNextDisabled}
          className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg shadow-md transition duration-150 ease-in-out disabled:opacity-50 text-lg"
        >
          {nextLabel}
        </button>
      )}
    </div>
  );
};

export default NavButtons;