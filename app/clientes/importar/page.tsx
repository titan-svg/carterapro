'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import {
  ArrowLeftIcon,
  UploadIcon,
  DocumentIcon,
  ExcelIcon,
  CheckIcon,
  XIcon,
  TrashIcon,
  DownloadIcon,
} from '@/components/Icons';
import { useAuth } from '@/context/AuthContext';

interface ParsedRow {
  name: string;
  email: string;
  phone: string;
  company?: string;
  city?: string;
  source?: string;
  valid: boolean;
  errors: string[];
}

const requiredColumns = ['name', 'email', 'phone'];
const optionalColumns = ['company', 'position', 'address', 'city', 'source', 'tags'];

export default function ImportarClientesPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importComplete, setImportComplete] = useState(false);
  const [importStats, setImportStats] = useState({ success: 0, failed: 0 });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const parseCSV = (content: string): ParsedRow[] => {
    const lines = content.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
      const row: Record<string, string> = {};

      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });

      const errors: string[] = [];

      if (!row.name) errors.push('Nombre requerido');
      if (!row.email) errors.push('Email requerido');
      else if (!validateEmail(row.email)) errors.push('Email invalido');
      if (!row.phone) errors.push('Telefono requerido');

      return {
        name: row.name || '',
        email: row.email || '',
        phone: row.phone || '',
        company: row.company,
        city: row.city,
        source: row.source,
        valid: errors.length === 0,
        errors,
      };
    });
  };

  const processFile = async (selectedFile: File) => {
    setIsProcessing(true);
    setFile(selectedFile);

    try {
      const content = await selectedFile.text();
      const data = parseCSV(content);
      setParsedData(data);
    } catch (error) {
      console.error('Error processing file:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.name.endsWith('.csv') || droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.xls'))) {
      processFile(droppedFile);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const handleRemoveRow = (index: number) => {
    setParsedData(prev => prev.filter((_, i) => i !== index));
  };

  const handleClearFile = () => {
    setFile(null);
    setParsedData([]);
    setImportComplete(false);
  };

  const handleImport = async () => {
    const validRows = parsedData.filter(row => row.valid);
    if (validRows.length === 0) return;

    setIsImporting(true);

    // Simulate import process
    await new Promise(resolve => setTimeout(resolve, 2000));

    setImportStats({
      success: validRows.length,
      failed: parsedData.length - validRows.length,
    });
    setImportComplete(true);
    setIsImporting(false);
  };

  const downloadTemplate = () => {
    const headers = ['name', 'email', 'phone', 'company', 'position', 'address', 'city', 'source', 'tags'];
    const exampleRow = ['Juan Perez', 'juan@ejemplo.com', '+52 55 1234 5678', 'Mi Empresa', 'Director', 'Calle 123', 'Ciudad de Mexico', 'Referido', 'VIP'];

    const csvContent = [headers.join(','), exampleRow.join(',')].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'plantilla_clientes.csv';
    link.click();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) return null;

  const validCount = parsedData.filter(r => r.valid).length;
  const invalidCount = parsedData.filter(r => !r.valid).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0 pb-20 lg:pb-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
          {/* Back Button */}
          <Link
            href="/clientes"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Volver a Clientes
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl font-bold text-slate-900">Importar Clientes</h1>
            <p className="text-slate-500 mt-1">
              Importa clientes desde un archivo CSV o Excel
            </p>
          </motion.div>

          {importComplete ? (
            // Import Complete View
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl border border-slate-200 p-8 text-center"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckIcon className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                Importacion Completada
              </h2>
              <p className="text-slate-500 mb-6">
                Se han importado los clientes exitosamente
              </p>
              <div className="flex justify-center gap-8 mb-8">
                <div className="text-center">
                  <p className="text-3xl font-bold text-emerald-600">{importStats.success}</p>
                  <p className="text-sm text-slate-500">Importados</p>
                </div>
                {importStats.failed > 0 && (
                  <div className="text-center">
                    <p className="text-3xl font-bold text-red-500">{importStats.failed}</p>
                    <p className="text-sm text-slate-500">Fallidos</p>
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleClearFile}
                  className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-medium"
                >
                  Importar Mas
                </button>
                <Link
                  href="/clientes"
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
                >
                  Ver Clientes
                </Link>
              </div>
            </motion.div>
          ) : !file ? (
            // Upload View
            <>
              {/* Instructions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl border border-slate-200 p-6 mb-6"
              >
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Instrucciones</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-slate-900 mb-2">Columnas requeridas</h3>
                    <ul className="space-y-1">
                      {requiredColumns.map(col => (
                        <li key={col} className="flex items-center gap-2 text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          {col}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 mb-2">Columnas opcionales</h3>
                    <ul className="space-y-1">
                      {optionalColumns.map(col => (
                        <li key={col} className="flex items-center gap-2 text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          {col}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <button
                    onClick={downloadTemplate}
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                  >
                    <DownloadIcon className="w-5 h-5" />
                    Descargar plantilla de ejemplo
                  </button>
                </div>
              </motion.div>

              {/* Drop Zone */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                    isDragging
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
                        isDragging ? 'bg-indigo-100' : 'bg-slate-100'
                      }`}
                    >
                      <UploadIcon
                        className={`w-8 h-8 transition-colors ${
                          isDragging ? 'text-indigo-600' : 'text-slate-400'
                        }`}
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {isDragging ? 'Suelta el archivo aqui' : 'Arrastra tu archivo aqui'}
                    </h3>
                    <p className="text-slate-500 mb-4">
                      o haz clic para seleccionar un archivo
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg">
                        <DocumentIcon className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-600">CSV</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg">
                        <ExcelIcon className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm text-emerald-700">Excel</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          ) : (
            // Preview View
            <>
              {/* File Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-slate-200 p-4 mb-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                      {file.name.endsWith('.csv') ? (
                        <DocumentIcon className="w-6 h-6 text-slate-600" />
                      ) : (
                        <ExcelIcon className="w-6 h-6 text-emerald-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{file.name}</p>
                      <p className="text-sm text-slate-500">
                        {(file.size / 1024).toFixed(1)} KB - {parsedData.length} filas detectadas
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClearFile}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <XIcon className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-3 gap-4 mb-6"
              >
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <p className="text-2xl font-bold text-slate-900">{parsedData.length}</p>
                  <p className="text-sm text-slate-500">Total de filas</p>
                </div>
                <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4">
                  <p className="text-2xl font-bold text-emerald-600">{validCount}</p>
                  <p className="text-sm text-emerald-700">Validas</p>
                </div>
                <div className="bg-red-50 rounded-xl border border-red-200 p-4">
                  <p className="text-2xl font-bold text-red-600">{invalidCount}</p>
                  <p className="text-sm text-red-700">Con errores</p>
                </div>
              </motion.div>

              {/* Preview Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6"
              >
                <div className="p-4 border-b border-slate-200">
                  <h2 className="font-semibold text-slate-900">Vista previa de datos</h2>
                </div>
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full">
                    <thead className="bg-slate-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                          Estado
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                          Nombre
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                          Email
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                          Telefono
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                          Empresa
                        </th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <AnimatePresence>
                        {parsedData.map((row, index) => (
                          <motion.tr
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, height: 0 }}
                            className={row.valid ? '' : 'bg-red-50'}
                          >
                            <td className="px-4 py-3">
                              {row.valid ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                                  <CheckIcon className="w-3 h-3" />
                                  Valido
                                </span>
                              ) : (
                                <span
                                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full cursor-help"
                                  title={row.errors.join(', ')}
                                >
                                  <XIcon className="w-3 h-3" />
                                  Error
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-900">
                              {row.name || <span className="text-red-500 italic">Vacio</span>}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-600">
                              {row.email || <span className="text-red-500 italic">Vacio</span>}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-600">
                              {row.phone || <span className="text-red-500 italic">Vacio</span>}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-600">
                              {row.company || '-'}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => handleRemoveRow(index)}
                                className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <button
                  onClick={handleClearFile}
                  className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleImport}
                  disabled={validCount === 0 || isImporting}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isImporting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Importando...
                    </>
                  ) : (
                    <>
                      <UploadIcon className="w-5 h-5" />
                      Importar {validCount} Clientes
                    </>
                  )}
                </button>
              </motion.div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
