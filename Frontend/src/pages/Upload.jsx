import React, { useState, useRef } from 'react';
import { Upload as UploadIcon, X, Loader2, FileImage, ShieldCheck, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../ToastContext';
import { compressImage } from '../services/compressor';


const Upload = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);
    const { showToast } = useToast();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (!selectedFile.type.startsWith('image/')) {
                setError('Please select a valid image file.');
                showToast('Invalid file type. Please select an image.', 'error');
                return;
            }
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setResult(null);
            setError('');
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        setError('');
        try {
            // Compress image before upload
            const compressedBlob = await compressImage(file, {
                maxWidth: 1024,
                maxHeight: 1024,
                quality: 0.7
            });

            // Convert Blob to File for the API service if needed, 
            // but our api.js usually handles FormData which accepts Blobs.
            const data = await api.uploadImage(compressedBlob);

            setResult(data);
            showToast(`Analysis complete: ${data.prediction}`, data.prediction === 'Real' ? 'success' : 'info');
        } catch (err) {
            setError(err.message || 'Failed to analyze image. Please try again.');
            showToast('Analysis failed. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const resetUpload = () => {
        setFile(null);
        setPreview(null);
        setResult(null);
        setError('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-8">
            <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-white mb-3">AI Image Analysis</h2>
                <p className="text-gray-400 text-lg">Upload an image to detect if it's AI-generated or authentic.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Upload Section */}
                <div className="space-y-6">
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`relative border-2 border-dashed rounded-3xl p-8 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[300px]
              ${preview ? 'border-primary/50 bg-primary/5' : 'border-gray-700 hover:border-primary/50 hover:bg-white/5'}`}
                    >
                        {preview ? (
                            <div className="relative w-full h-full flex items-center justify-center">
                                <img src={preview} alt="Preview" className="max-h-[250px] rounded-xl object-contain shadow-2xl" />
                                <button
                                    onClick={(e) => { e.stopPropagation(); resetUpload(); }}
                                    className="absolute -top-4 -right-4 p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors shadow-lg"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 transform transition-transform group-hover:scale-110">
                                    <UploadIcon className="w-8 h-8 text-primary" />
                                </div>
                                <p className="text-white font-medium text-lg">Click or drag image here</p>
                                <p className="text-gray-500 text-sm mt-2">Supports JPG, PNG, WEBP</p>
                            </>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={!file || loading}
                        className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-lg"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                Analyzing Patterns...
                            </>
                        ) : (
                            <>
                                <FileImage className="w-6 h-6" />
                                Run Detection
                            </>
                        )}
                    </button>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-sm text-center">
                            {error}
                        </div>
                    )}
                </div>

                {/* Result Section */}
                <div className="bg-dark-lighter border border-gray-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
                    {!result && !loading && (
                        <div className="text-gray-500">
                            <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShieldCheck className="w-10 h-10 opacity-20" />
                            </div>
                            <p className="text-xl font-medium">Ready for Analysis</p>
                            <p className="mt-2">Upload an image to see results here</p>
                        </div>
                    )}

                    {loading && (
                        <div className="flex flex-col items-center">
                            <div className="relative w-24 h-24 mb-6">
                                <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                <Loader2 className="absolute inset-0 m-auto w-10 h-10 text-primary animate-pulse" />
                            </div>
                            <p className="text-white text-xl font-bold animate-pulse">Scanning Image...</p>
                            <p className="text-gray-400 mt-2">Checking for deepfake artifact signatures</p>
                        </div>
                    )}

                    {result && (
                        <div className="w-full animate-in fade-in zoom-in duration-300">
                            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl
                ${result.prediction === 'Real' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}
                            >
                                {result.prediction === 'Real' ? <ShieldCheck className="w-12 h-12" /> : <ShieldAlert className="w-12 h-12" />}
                            </div>

                            <h3 className={`text-4xl font-extrabold mb-2 ${result.prediction === 'Real' ? 'text-green-500' : 'text-red-500'}`}>
                                {result.prediction.toUpperCase()}
                            </h3>

                            <div className="bg-dark p-6 rounded-2xl border border-gray-800 inline-block w-full">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-400 font-medium">Confidence Score</span>
                                    <span className={`text-2xl font-bold ${result.prediction === 'Real' ? 'text-green-400' : 'text-red-400'}`}>
                                        {(result.confidence * 100).toFixed(2)}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-1000 ease-out ${result.prediction === 'Real' ? 'bg-green-500' : 'bg-red-500'}`}
                                        style={{ width: `${result.confidence * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <p className="text-gray-400 mt-6 text-sm italic">
                                {result.prediction === 'Real'
                                    ? "This image appears to be an authentic photograph with standard photographic artifacts."
                                    : "We detected anomalies in the image patterns typical of AI generation models."
                                }
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Upload;
