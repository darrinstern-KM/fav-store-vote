import { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  shopId: string;
  error: string;
}

interface ImportResult {
  success: boolean;
  summary: {
    totalParsed: number;
    inserted: number;
    updated: number;
    errors: number;
  };
  errors: ImportError[];
}

export const ExcelImport = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [importBatches, setImportBatches] = useState<ImportBatch[]>([]);
  const [selectedBatchErrors, setSelectedBatchErrors] = useState<ImportError[]>([]);
  const [showErrors, setShowErrors] = useState(false);
  const [lastResult, setLastResult] = useState<ImportResult | null>(null);
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
    setLastResult(null);

    try {
      // Read the file content
      const csvData = await file.text();
      
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please log in as an admin to import stores",
          variant: "destructive"
        });
        return;
      }

      // Call the edge function
      const response = await fetch(
        'https://rsndsydjbcqlmkjkrosj.supabase.co/functions/v1/import-stores',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ csvData }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Import failed');
      }

      setLastResult(result);

      // Add to import history
      const batch: ImportBatch = {
        id: Math.random().toString(),
        filename: file.name,
        total_rows: result.summary.totalParsed,
        successful_imports: result.summary.inserted + result.summary.updated,
        failed_imports: result.summary.errors,
        import_status: result.summary.errors > 0 ? 'completed' : 'completed',
        created_at: new Date().toISOString()
      };
      
      setImportBatches(prev => [batch, ...prev]);

      if (result.errors?.length > 0) {
        setSelectedBatchErrors(result.errors);
      }

      toast({
        title: "Import completed!",
        description: `Inserted: ${result.summary.inserted}, Updated: ${result.summary.updated}, Errors: ${result.summary.errors}`
      });

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Import failed",
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

  const downloadTemplate = () => {
    // Create CSV template matching the expected format
    const headers = [
      'shop_num_1',
      'shop_name',
      'shop_addr_1',
      'shop_addr_2',
      'shop_city',
      'shop_state',
      'shop_zip',
      'shop_addr_1_m',
      'shop_addr_2_m',
      'shop_city_m',
      'shop_state_m',
      'shop_zip_m',
      'shop_phone_1',
      'shop_phone_2',
      'shop_email',
      'shop_website',
      'shop_owner',
      'shop_hours',
      'shop_mdse'
    ];
    
    const sampleData = [
      '12345',
      'Sample Craft Store',
      '123 Main Street',
      'Suite A',
      'Springfield',
      'IL',
      '62701',
      '',
      '',
      '',
      '',
      '',
      '(555) 123-4567',
      '',
      'contact@samplestore.com',
      'https://samplestore.com',
      'John Smith',
      'Mon-Fri 9-5, Sat 10-4',
      'C'
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            CSV Store Import
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Upload a CSV file with store data. Required columns: <strong>shop_num_1</strong> (unique ID), <strong>shop_name</strong>. 
              Optional: shop_addr_1, shop_addr_2, shop_city, shop_state, shop_zip, shop_phone_1, shop_phone_2, shop_email, shop_website, shop_owner, shop_hours, shop_mdse.
              Existing stores will be updated, new stores will be added as approved.
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
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Upload CSV
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Last Import Result */}
          {lastResult && (
            <div className="mt-4 p-4 border rounded-lg bg-muted/50">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Import Summary
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Parsed:</span>
                  <span className="ml-2 font-medium">{lastResult.summary.totalParsed}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Inserted:</span>
                  <span className="ml-2 font-medium text-green-600">{lastResult.summary.inserted}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Updated:</span>
                  <span className="ml-2 font-medium text-blue-600">{lastResult.summary.updated}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Errors:</span>
                  <span className="ml-2 font-medium text-red-600">{lastResult.summary.errors}</span>
                </div>
              </div>
            </div>
          )}
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
                      onClick={() => setShowErrors(true)}
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
      {showErrors && selectedBatchErrors.length > 0 && (
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
                    <span className="text-sm font-medium">Shop ID: {error.shopId}</span>
                    <Badge variant="destructive" className="text-xs">Error</Badge>
                  </div>
                  <p className="text-sm text-red-600">{error.error}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
