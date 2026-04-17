function FullScreenLoader({ show }) {
    return (
        <div
            className={`
        fixed inset-0 z-50 flex items-center justify-center
        bg-gray-900 transition-opacity duration-300
        ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
        >
            <div className="w-10 h-10 border-4 border-gray-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );
}

export default FullScreenLoader;