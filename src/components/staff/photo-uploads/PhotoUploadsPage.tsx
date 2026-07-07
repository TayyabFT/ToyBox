"use client";

import { PhotoUploadsGreeting } from "./PhotoUploadsGreeting";
import { CameraCapturePanel } from "./CameraCapturePanel";
import { TodaysCaptures } from "./TodaysCaptures";
import { SelectedPhotoPanel } from "./SelectedPhotoPanel";
import { RecentUploads } from "./RecentUploads";
import { UploadFromDevice } from "./UploadFromDevice";
import { useStaffPhotoUploads } from "./useStaffPhotoUploads";

export function PhotoUploadsPage() {
  const {
    activeFilter,
    activeServiceTab,
    activeCaptureMode,
    captureInputAccept,
    captureInputMultiple,
    showRecBadge,
    viewfinderPreviewUrl,
    viewfinderZoom,
    header,
    tabs,
    cameraContext,
    todayCaptures,
    todaySummary,
    recentUploads,
    selectedPhoto,
    selectedCaptureId,
    loading,
    detailLoading,
    actionLoading,
    isEditing,
    draft,
    captureInputRef,
    uploadInputRef,
    changeFilter,
    setActiveServiceTab,
    setActiveCaptureMode,
    selectCapture,
    deleteCapture,
    selectRecentUpload,
    handleShutter,
    handleCaptureFiles,
    handleDeviceUpload,
    handleAddPhoto,
    saveSelectedPhoto,
    syncSelectedPhoto,
    handleUploadNow,
    handleUploadAll,
    zoomViewfinderIn,
    zoomViewfinderOut,
    startEditing,
    cancelEditing,
    updateDraft,
  } = useStaffPhotoUploads();

  return (
    <div className="space-y-8 p-8">
      <PhotoUploadsGreeting
        header={header}
        activeFilter={activeFilter}
        tabs={tabs}
        onFilterChange={changeFilter}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <CameraCapturePanel
            cameraContext={cameraContext}
            activeService={activeServiceTab}
            activeMode={activeCaptureMode}
            previewUrl={viewfinderPreviewUrl}
            previewZoom={viewfinderZoom}
            actionLoading={actionLoading}
            showRecBadge={showRecBadge}
            onServiceChange={setActiveServiceTab}
            onModeChange={setActiveCaptureMode}
            onZoomIn={zoomViewfinderIn}
            onZoomOut={zoomViewfinderOut}
            onShutter={handleShutter}
          />
          <TodaysCaptures
            captures={todayCaptures}
            summary={todaySummary}
            selectedId={selectedCaptureId}
            loading={loading}
            actionLoading={actionLoading}
            onSelect={selectCapture}
            onDelete={deleteCapture}
            onUploadAll={() => void handleUploadAll()}
            onUploadNow={() => void handleUploadNow()}
            onAddPhoto={handleAddPhoto}
            onUploadFile={() => captureInputRef.current?.click()}
          />
        </div>

        <div className="space-y-6">
          <SelectedPhotoPanel
            photo={selectedPhoto}
            draft={draft}
            loading={detailLoading}
            actionLoading={actionLoading}
            isEditing={isEditing}
            onStartEdit={startEditing}
            onCancelEdit={cancelEditing}
            onDraftChange={updateDraft}
            onUpload={() => void syncSelectedPhoto()}
            onSave={() => void saveSelectedPhoto()}
          />
          <RecentUploads
            uploads={recentUploads}
            selectedId={selectedCaptureId}
            loading={loading}
            onSelect={selectRecentUpload}
          />
          <UploadFromDevice
            actionLoading={actionLoading}
            onUpload={(file) => void handleDeviceUpload(file)}
          />
        </div>
      </div>

      <input
        ref={captureInputRef}
        type="file"
        accept={captureInputAccept}
        capture="environment"
        multiple={captureInputMultiple}
        className="hidden"
        onChange={(event) => {
          void handleCaptureFiles(event.target.files);
          event.target.value = "";
        }}
      />

      <input
        ref={uploadInputRef}
        type="file"
        accept="image/jpeg,image/png,image/heic,image/webp"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (file) {
            void handleDeviceUpload(file);
          }

          event.target.value = "";
        }}
      />
    </div>
  );
}
