

<template>

   
</template>

<style scoped>
.header {
        width: 100%;
        background-color: #f0f0f0;
        padding: 15px;
        border: 1px solid #ccc; 
        border-radius: 10px;
        margin-bottom: 20px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }

    .two-column-layout {
        
        display: grid;
        grid-template-columns: 1fr 1fr; /* Creates two equal-width columns */
        gap: 20px; /* Adds space between columns (optional) */
        border-radius: 10px;
    }

    .column-left,
    .column-right {
         border: 1px solid #ccc; 
        border-radius: 10px;
        padding: 20px;
        background-color: #f0f0f0;
        margin-bottom:20px;
    }
</style>