'use client';

export function TypingIndicator({withLabel = true}: {withLabel?: boolean}) {
  return (
    <div className="flex justify-start">
      <div className="flex items-start space-x-2 max-w-[80%]">
        <div className="bg-white text-gray-800 px-3 py-2 rounded-lg rounded-bl-none shadow-sm">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
            {withLabel && <span className="text-sm text-gray-500 ml-2">Digitando...</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
