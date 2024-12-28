<template>
    <el-table :data="songs" height="100vh" style="width: 100%">
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="时长" prop="duration"></el-table-column>
        <!-- 操作列：导入、播放按钮 -->
        <el-table-column align="right">
            <!-- 表头的导入本地按钮 -->
            <template slot="header" slot-scope="scope">
                <el-button type="primary" @click="upload" style="width: 90px;">导入本地</el-button>
                <!-- 上传TXT文件按钮 -->
                <el-button type="success" @click="selectTxtFile" style="width: 90px;">上传txt</el-button>
                <el-button type="danger" @click="downloadMp3" style="width: 90px;">下载 MP3 </el-button>
            </template>
            <!-- 每一行的播放按钮 -->
            <template slot-scope="scope">
                <el-button size="mini" icon="el-icon-video-play" @click="play(scope.$index, scope.row)"></el-button>
            </template>
        </el-table-column>
    </el-table>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { uploadFiles } from '../utils'
import { uploadTxtFile, downloadMp3File } from '../api/musicApi.js'
export default {
    computed: {
        ...mapGetters(['index', 'localSongs', 'playingSongs', 'playedSongs']),
        songs() {
            switch (this.$route.path) {
                case '/playingmusic':
                    return this.playingSongs
                case '/playedmusic':
                    return this.playedSongs
                default:
                    return this.localSongs
            }
        }
    },
    methods: {
        ...mapActions(['handlePlay', 'handleClickSong', 'handleUpload']),
        play(_, row) {
            console.log({ index: this.index, audio: row.audio, name: row.name })
            this.handleClickSong({ index: this.index, audio: row.audio, name: row.name })
        },
        async upload() {
            this.$message('加载中，请等候...')
            this.handleUpload(await uploadFiles())
        },
        selectTxtFile() {
            // 触发input的点击事件
            const input = document.createElement('input')
            input.type = 'file'
            input.accept = '.txt'
            input.onchange = this.handleTxtFileChange
            input.click()
        },
        async handleTxtFileChange(event) {
            const file = event.target.files[0]
            if (file && file.type === 'text/plain') {
                try {
                    this.$message('上传中...')
                    const response = await uploadTxtFile(file)
                    console.log('上传成功', response)
                    this.$message.success('TXT文件上传成功！')
                } catch (error) {
                    console.error('上传失败', error)
                    this.$message.error(`上传失败：${error.message || error}`)
                }
            } else {
                this.$message.error('请上传TXT文件')
            }
        },
        // 调用 API 中的 downloadMp3File 方法
        async downloadMp3() {
            try {
                console.log("here")
                const message = await downloadMp3File(); // 调用 API 方法
                this.$message.success(message);
            } catch (error) {
                this.$message.error(error.message || '下载失败');
            }
        },

    }
}
</script>
<style>
.my-main {
    width: 100%;
}
</style>