import { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface ImportBatch {
  id: string;
  filename: string;
  total_rows: number;
  successful_imports: number;
  failed_imports: number;
  import_status: 'processing' | 'completed' | 'failed';
  error_log?: string;
  created_at: string;
}

interface ImportError {
  row_number: number;
  row_data: any;
  error_message: string;
}

export const ExcelImport = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [importBatches, setImportBatches] = useState<ImportBatch[]>([]);
  const [selectedBatchErrors, setSelectedBatchErrors] = useState<ImportError[]>([]);
  const [showErrors, setShowErrors] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.match(/\.(xlsx|xls|csv)$/)) {
      toast({
        title: "Invalid file type",
        description: "Please upload an Excel (.xlsx, .xls) or CSV file",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      // Since Supabase is connected, you can implement the actual import logic here
      // For now, this is a placeholder that demonstrates the UI
      
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Upload successful!",
        description: `Started processing ${file.name}. File upload functionality ready - implement with Supabase Edge Functions.`
      });

      // Add a demo batch to show the UI
      const demoBatch: ImportBatch = {
        id: Math.random().toString(),
        filename: file.name,
        total_rows: 100,
        successful_imports: 95,
        failed_imports: 5,
        import_status: 'completed',
        created_at: new Date().toISOString()
      };
      
      setImportBatches(prev => [demoBatch, ...prev]);

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload and process file",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const fetchImportBatches = async () => {
    // Placeholder for Supabase integration
    // When implementing, use: supabase.from('store_import_batches').select('*')
    console.log('Fetching import batches from Supabase...');
  };

  const fetchBatchErrors = async (batchId: string) => {
    // Demo errors for UI demonstration
    const demoErrors: ImportError[] = [
      {
        row_number: 3,
        row_data: { name: "Test Store", address: "", city: "Springfield" },
        error_message: "Address field is required"
      },
      {
        row_number: 7,
        row_data: { name: "", address: "123 Main St", city: "Springfield" },
        error_message: "Store name is required"
      }
    ];
    
    setSelectedBatchErrors(demoErrors);
    setShowErrors(true);
  };

  const downloadTemplate = () => {
    // Create CSV template with required columns
    const headers = [
      'name',
      'address', 
      'city',
      'state',
      'zip_code',
      'category',
      'phone',
      'website',
      'description'
    ];
    
    const sampleData = [
      'Downtown Electronics',
      '123 Main St',
      'Springfield',
      'IL',
      '62701',
      'Electronics',
      '555-123-4567',
      'https://downtown-electronics.com',
      'Your local electronics store with the best prices and service'
    ];

    const csvContent = [
      headers.join(','),
      sampleData.join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'store-import-template.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Load import batches on component mount
  // useState(() => {
  //   fetchImportBatches();
  // });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Excel/CSV Store Import
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Upload an Excel or CSV file with store data. Required columns: name, address, city, state, zip_code, category. 
              Optional columns: phone, website, description. Implement with Supabase Edge Functions for full functionality.
            </AlertDescription>
          </Alert>

          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={downloadTemplate}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Template
            </Button>

            <div className="flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                {isUploading ? 'Uploading...' : 'Upload File'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Import History */}
      <Card>
        <CardHeader>
          <CardTitle>Import History</CardTitle>
        </CardHeader>
        <CardContent>
          {importBatches.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No imports yet. Upload your first file to get started.
            </p>
          ) : (
            <div className="space-y-4">
              {importBatches.map((batch) => (
                <div key={batch.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{batch.filename}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(batch.created_at).toLocaleString()}
                      </p>
                    </div>
                    {getStatusBadge(batch.import_status)}
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Total Rows:</span>
                      <span className="ml-2 font-medium">{batch.total_rows}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Success:</span>
                      <span className="ml-2 font-medium text-green-600">
                        {batch.successful_imports}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Failed:</span>
                      <span className="ml-2 font-medium text-red-600">
                        {batch.failed_imports}
                      </span>
                    </div>
                  </div>

                  {batch.total_rows > 0 && (
                    <Progress 
                      value={(batch.successful_imports / batch.total_rows) * 100}
                      className="h-2"
                    />
                  )}

                  {batch.failed_imports > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchBatchErrors(batch.id)}
                    >
                      View Error Details ({batch.failed_imports})
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Details Modal */}
      {showErrors && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Import Errors</CardTitle>
              <Button variant="outline" onClick={() => setShowErrors(false)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {selectedBatchErrors.map((error, index) => (
                <div key={index} className="border rounded p-3 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium">Row {error.row_number}</span>
                    <Badge variant="destructive" className="text-xs">Error</Badge>
                  </div>
                  <p className="text-sm text-red-600">{error.error_message}</p>
                  <details className="text-xs">
                    <summary className="cursor-pointer text-muted-foreground">
                      View row data
                    </summary>
                    <pre className="mt-2 bg-muted p-2 rounded text-xs overflow-x-auto">
                      {JSON.stringify(error.row_data, null, 2)}
                    </pre>
                  </details>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};